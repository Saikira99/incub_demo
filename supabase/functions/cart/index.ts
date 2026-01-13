// Backend Edge Function: Cart API
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CartItem {
  productId: string
  quantity: number
  addedAt: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
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

    // GET cart
    if (req.method === 'GET') {
      const { data: cart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .single()

      const items = cart?.items as CartItem[] || []

      return new Response(JSON.stringify({ success: true, data: { cart, items } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST add to cart
    if (req.method === 'POST') {
      const body = await req.json()
      const { productId, quantity = 1 } = body

      // Get current cart
      let { data: cart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .single()

      let items: CartItem[] = cart?.items as CartItem[] || []

      // Check if product exists in cart
      const existingIndex = items.findIndex(item => item.productId === productId)
      
      if (existingIndex >= 0) {
        items[existingIndex].quantity += quantity
      } else {
        items.push({
          productId,
          quantity,
          addedAt: new Date().toISOString(),
        })
      }

      // Upsert cart
      if (cart) {
        const { error } = await supabase
          .from('carts')
          .update({ items, updated_at: new Date().toISOString() })
          .eq('user_id', userId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('carts')
          .insert({ user_id: userId, items })

        if (error) throw error
      }

      return new Response(JSON.stringify({ success: true, data: items }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // PUT update quantity
    if (req.method === 'PUT') {
      const body = await req.json()
      const { productId, quantity } = body

      const { data: cart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .single()

      let items: CartItem[] = cart?.items as CartItem[] || []

      if (quantity <= 0) {
        items = items.filter(item => item.productId !== productId)
      } else {
        const index = items.findIndex(item => item.productId === productId)
        if (index >= 0) {
          items[index].quantity = quantity
        }
      }

      const { error } = await supabase
        .from('carts')
        .update({ items, updated_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data: items }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // DELETE clear cart or remove item
    if (req.method === 'DELETE') {
      const url = new URL(req.url)
      const productId = url.searchParams.get('productId')

      if (productId) {
        const { data: cart } = await supabase
          .from('carts')
          .select('*')
          .eq('user_id', userId)
          .single()

        let items: CartItem[] = cart?.items as CartItem[] || []
        items = items.filter(item => item.productId !== productId)

        const { error } = await supabase
          .from('carts')
          .update({ items, updated_at: new Date().toISOString() })
          .eq('user_id', userId)

        if (error) throw error

        return new Response(JSON.stringify({ success: true, data: items }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Clear entire cart
      const { error } = await supabase
        .from('carts')
        .update({ items: [], updated_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Cart API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
