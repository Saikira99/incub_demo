// Backend Edge Function: Admin Dashboard Stats
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

    // Get dashboard stats
    const [
      { count: totalProducts },
      { count: publishedProducts },
      { count: totalOrders },
      { count: pendingOrders },
      { data: recentOrders },
      { count: totalUsers },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_deleted', false),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published').eq('is_deleted', false),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])

    // Calculate revenue
    const { data: ordersForRevenue } = await supabase
      .from('orders')
      .select('final_amount')
      .in('status', ['confirmed', 'completed'])

    const totalRevenue = ordersForRevenue?.reduce((sum, o) => sum + Number(o.final_amount), 0) || 0

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalProducts: totalProducts || 0,
        publishedProducts: publishedProducts || 0,
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        recentOrders: recentOrders || [],
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Admin Stats API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
