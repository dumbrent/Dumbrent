import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateSubscriptionRequest {
  listingId: string
  planType: 'monthly' | 'quarterly'
  successUrl?: string
  cancelUrl?: string
  guestEmail?: string
  guestName?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { listingId, planType, successUrl, cancelUrl, guestEmail, guestName }: CreateSubscriptionRequest = await req.json()

    console.log('Creating subscription for:', { listingId, planType })

    let user = null
    let userEmail = null

    // Handle guest payments for temp listings
    if (listingId === 'temp') {
      console.log('Processing guest payment for temp listing')
      if (!guestEmail) {
        throw new Error('Guest email is required for temp listings')
      }
      userEmail = guestEmail
    } else {
      // Get the authenticated user for existing listings
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        throw new Error('Authorization header is required for existing listings')
      }
      
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: authUser } } = await supabaseClient.auth.getUser(token)

      if (!authUser) {
        throw new Error('User not authenticated')
      }
      
      user = authUser
      userEmail = user.email

      // Verify the listing belongs to the user
      const { data: listing, error: listingError } = await supabaseClient
        .from('listings')
        .select('id, title, landlord_id')
        .eq('id', listingId)
        .eq('landlord_id', user.id)
        .single()

      if (listingError || !listing) {
        throw new Error('Listing not found or access denied')
      }
    }

    // Define the price IDs for each plan
    // These should be recurring subscription price IDs
    const priceIds = {
      monthly: 'price_1RdWCKHrAzxRBItJ3JtPjwdO',    // $100/month recurring
      quarterly: 'price_1RdWDHHrAzxRBItJbhdbnrUo'   // $175 every 90 days recurring
    }

    // Get the appropriate price ID
    const priceId = priceIds[planType]
    if (!priceId) {
      throw new Error(`Invalid plan type: ${planType}`)
    }

    // Calculate duration based on plan type
    let duration = 0

    if (planType === 'monthly') {
      duration = 30 // 30 days
    } else if (planType === 'quarterly') {
      duration = 90 // 90 days
    }

    console.log('Creating Stripe checkout session with:', { priceId, planType, duration })

    // Create Stripe checkout session for recurring subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Use subscription mode for recurring billing
      success_url: successUrl || `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/submit-listing`,
      metadata: {
        listingId,
        planType,
        userId: user?.id || 'temp',
        duration: duration.toString(),
        guestEmail: guestEmail || '',
        guestName: guestName || '',
      },
      customer_email: userEmail,
      // Add subscription data for recurring billing
      subscription_data: {
        metadata: {
          listingId,
          planType,
          userId: user?.id || 'temp',
          guestEmail: guestEmail || '',
          guestName: guestName || '',
        },
      },
    })

    console.log('Stripe session created:', session.id)

    // Store the subscription record in Supabase
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + duration)

    // For temp listings, we'll create the subscription record after account creation
    if (listingId !== 'temp') {
      const { error: subscriptionError } = await supabaseClient
        .from('listing_subscriptions')
        .insert({
          listing_id: listingId,
          owner_id: user!.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          amount_paid: planType === 'monthly' ? 100 : 175, // Initial payment amount
          plan_type: planType,
          stripe_session_id: session.id,
          status: 'pending',
          recurring: true, // Mark as recurring subscription
          billing_cycle: planType === 'monthly' ? 30 : 90, // Days between billing cycles
        })

      if (subscriptionError) {
        console.error('Error creating subscription record:', subscriptionError)
        // Don't fail the entire request if subscription record creation fails
      } else {
        console.log('Subscription record created successfully')
      }
    }

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})