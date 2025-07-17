import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable is not set')
      return new Response('Server configuration error', { status: 500 })
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET environment variable is not set')
      return new Response('Server configuration error', { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('Missing stripe-signature header')
      return new Response('Missing signature', { status: 400 })
    }

    // Get the raw body
    const body = await req.text()
    
    let event: Stripe.Event

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('Webhook signature verified successfully')
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    console.log('Processing webhook event:', event.type)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Processing checkout.session.completed:', session.id)
        
        if (session.payment_status === 'paid') {
          try {
            // Get metadata from the session
            const { listingId, planType, userId, duration, amount } = session.metadata || {}
            
            if (!listingId || !planType || !userId) {
              console.error('Missing required metadata in session:', session.metadata)
              return new Response('Missing metadata', { status: 400 })
            }

            console.log('Processing payment for:', { listingId, planType, userId })

            // Calculate subscription end date based on plan type
            const startDate = new Date()
            const endDate = new Date()
            
            if (planType === 'monthly') {
              endDate.setDate(startDate.getDate() + 30)
            } else if (planType === 'quarterly') {
              endDate.setDate(startDate.getDate() + 90)
            } else {
              console.error('Invalid plan type:', planType)
              return new Response('Invalid plan type', { status: 400 })
            }

            console.log('Calculated subscription dates:', {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString()
            })

            // Update the listing status to published
            const { error: listingError } = await supabaseClient
              .from('listings')
              .update({ 
                status: 'published'
              })
              .eq('id', listingId)
              .eq('landlord_id', userId)

            if (listingError) {
              console.error('Error updating listing status:', listingError)
              throw new Error(`Failed to update listing: ${listingError.message}`)
            }

            console.log(`Listing ${listingId} status updated to published`)

            // Update the subscription status to active
            const { error: subscriptionError } = await supabaseClient
              .from('listing_subscriptions')
              .update({ 
                status: 'active',
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
              })
              .eq('stripe_session_id', session.id)

            if (subscriptionError) {
              console.error('Error updating subscription status:', subscriptionError)
              // Don't fail the entire webhook if subscription update fails
              // The listing is already published, which is the main goal
            } else {
              console.log(`Subscription for session ${session.id} updated to active`)
            }

            // Log successful processing
            console.log(`Successfully processed payment for listing ${listingId}`)

          } catch (error) {
            console.error('Error processing checkout.session.completed:', error)
            return new Response(`Processing error: ${error.message}`, { status: 500 })
          }
        } else {
          console.log('Payment not completed, status:', session.payment_status)
        }
        break

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed for payment intent:', paymentIntent.id)
        
        // You could update the subscription status to 'failed' here if needed
        // For now, we'll just log it
        break

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice
        console.log('Invoice payment failed:', invoice.id)
        
        // Handle failed recurring payments if you implement them later
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response('Webhook handled successfully', { 
      status: 200,
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('Error handling webhook:', error)
    return new Response(`Webhook handler failed: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    })
  }
})