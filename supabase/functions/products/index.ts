// Backend Edge Function: Products API
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    )

    const url = new URL(req.url)
    const productId = url.searchParams.get('id')
    const categoryId = url.searchParams.get('categoryId')
    const search = url.searchParams.get('search')
    const featured = url.searchParams.get('featured')
    const newArrivals = url.searchParams.get('new')
    const limit = parseInt(url.searchParams.get('limit') || '20')

    // GET single product
    if (productId) {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', productId)
        .eq('status', 'published')
        .eq('is_deleted', false)
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET products list with filters
    let query = supabase
      .from('products')
      .select('*, categories(*)')
      .eq('status', 'published')
      .eq('is_deleted', false)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (newArrivals === 'true') {
      query = query.eq('is_new', true).order('created_at', { ascending: false })
    }

    const { data, error } = await query.limit(limit)

    if (error) throw error

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Products API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
