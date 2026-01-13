// Backend Edge Function: Admin Products API
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: authData, error: authError } = await supabase.auth.getClaims(token)
    
    if (authError || !authData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = authData.claims.sub

    // Check if user is admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single()

    if (!roleData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)

    // GET - List all products (including drafts)
    if (req.method === 'GET') {
      const productId = url.searchParams.get('id')
      const status = url.searchParams.get('status')
      const search = url.searchParams.get('search')

      if (productId) {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(*)')
          .eq('id', productId)
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      let query = supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST - Create product
    if (req.method === 'POST') {
      const body = await req.json()
      const {
        title,
        description,
        shortDescription,
        price,
        discountPercent = 0,
        categoryId,
        sku,
        stockQuantity = 0,
        thumbnailUrl,
        imagesUrls = [],
        specifications = {},
        status = 'draft',
        isFeatured = false,
        isNew = true,
      } = body

      const finalPrice = price - (price * discountPercent / 100)

      const { data, error } = await supabase
        .from('products')
        .insert({
          title,
          description,
          short_description: shortDescription,
          price,
          discount_percent: discountPercent,
          final_price: finalPrice,
          category_id: categoryId,
          sku,
          stock_quantity: stockQuantity,
          thumbnail_url: thumbnailUrl,
          images_urls: imagesUrls,
          specifications,
          status,
          is_featured: isFeatured,
          is_new: isNew,
          created_by_admin_id: userId,
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, data }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT - Update product
    if (req.method === 'PUT') {
      const body = await req.json()
      const { id, ...updates } = body

      if (!id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Product ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Map camelCase to snake_case
      const dbUpdates: Record<string, unknown> = {}
      if (updates.title !== undefined) dbUpdates.title = updates.title
      if (updates.description !== undefined) dbUpdates.description = updates.description
      if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription
      if (updates.price !== undefined) dbUpdates.price = updates.price
      if (updates.discountPercent !== undefined) dbUpdates.discount_percent = updates.discountPercent
      if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId
      if (updates.sku !== undefined) dbUpdates.sku = updates.sku
      if (updates.stockQuantity !== undefined) dbUpdates.stock_quantity = updates.stockQuantity
      if (updates.thumbnailUrl !== undefined) dbUpdates.thumbnail_url = updates.thumbnailUrl
      if (updates.imagesUrls !== undefined) dbUpdates.images_urls = updates.imagesUrls
      if (updates.specifications !== undefined) dbUpdates.specifications = updates.specifications
      if (updates.status !== undefined) dbUpdates.status = updates.status
      if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured
      if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew

      // Recalculate final price if needed
      if (updates.price !== undefined || updates.discountPercent !== undefined) {
        const { data: existing } = await supabase
          .from('products')
          .select('price, discount_percent')
          .eq('id', id)
          .single()

        const price = updates.price ?? existing?.price ?? 0
        const discount = updates.discountPercent ?? existing?.discount_percent ?? 0
        dbUpdates.final_price = price - (price * discount / 100)
      }

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // DELETE - Soft delete product
    if (req.method === 'DELETE') {
      const productId = url.searchParams.get('id')

      if (!productId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Product ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error } = await supabase
        .from('products')
        .update({ is_deleted: true, status: 'draft' })
        .eq('id', productId)

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin Products API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
