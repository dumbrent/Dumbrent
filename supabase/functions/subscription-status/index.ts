import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SubscriptionStatusRequest {
  listingId: string
}

interface SubscriptionStatusResponse {
  status: 'active' | 'expired' | 'none'
  start_date?: string
  end_date?: string
  days_remaining: number
  plan_type?: string
  amount_paid?: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')

    if (!supabaseServiceKey || !supabaseUrl) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { listingId }: SubscriptionStatusRequest = await req.json()

    if (!listingId) {
      return new Response(
        JSON.stringify({ error: 'listingId is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('Checking subscription status for listing:', listingId)

    // Get the authenticated user (optional - for additional security)
    const authHeader = req.headers.get('Authorization')
    let user = null
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: authUser } } = await supabaseClient.auth.getUser(token)
      user = authUser
    }

    // Query the most recent subscription for the listing
    const { data: subscription, error } = await supabaseClient
      .from('listing_subscriptions')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error querying subscription:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to query subscription status' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // If no subscription exists
    if (!subscription) {
      console.log('No subscription found for listing:', listingId)
      const response: SubscriptionStatusResponse = {
        status: 'none',
        days_remaining: 0
      }

      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    console.log('Found subscription:', {
      id: subscription.id,
      status: subscription.status,
      start_date: subscription.start_date,
      end_date: subscription.end_date
    })

    // Calculate days remaining
    const now = new Date()
    const endDate = new Date(subscription.end_date)
    const timeDiff = endDate.getTime() - now.getTime()
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)))

    // Determine status
    let status: 'active' | 'expired' | 'none'
    
    if (subscription.status === 'cancelled') {
      status = 'expired'
    } else if (subscription.status === 'expired') {
      status = 'expired'
    } else if (daysRemaining <= 0) {
      status = 'expired'
      
      // Update the subscription status in the database if it's expired but not marked as such
      if (subscription.status === 'active') {
        console.log('Updating expired subscription status in database')
        await supabaseClient
          .from('listing_subscriptions')
          .update({ status: 'expired' })
          .eq('id', subscription.id)
      }
    } else {
      status = 'active'
    }

    const response: SubscriptionStatusResponse = {
      status,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      days_remaining: daysRemaining,
      plan_type: subscription.plan_type,
      amount_paid: subscription.amount_paid
    }

    console.log('Subscription status response:', response)

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error checking subscription status:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})