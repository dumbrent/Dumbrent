import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface FeedbackEmailRequest {
  name: string
  email: string
  category: string
  rating: number
  subject: string
  message: string
  allowContact: boolean
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, category, rating, subject, message, allowContact }: FeedbackEmailRequest = await req.json()

    // Create the email content
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Feedback Submission - Dumb Rent NYC</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #4f46e5; }
        .rating { color: #f59e0b; }
        .footer { background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Feedback Submission</h1>
            <p>Dumb Rent NYC</p>
        </div>
        
        <div class="content">
            <div class="field">
                <span class="label">From:</span> ${name} (${email})
            </div>
            
            <div class="field">
                <span class="label">Category:</span> ${category}
            </div>
            
            <div class="field">
                <span class="label">Rating:</span> 
                <span class="rating">${'★'.repeat(rating)}${'☆'.repeat(5-rating)} (${rating}/5)</span>
            </div>
            
            <div class="field">
                <span class="label">Subject:</span> ${subject}
            </div>
            
            <div class="field">
                <span class="label">Message:</span>
                <div style="background: white; padding: 15px; border-left: 4px solid #4f46e5; margin-top: 10px;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
            
            <div class="field">
                <span class="label">Contact Permission:</span> 
                ${allowContact ? '✅ User allows follow-up contact' : '❌ User prefers no follow-up contact'}
            </div>
            
            <div class="field">
                <span class="label">Submitted:</span> ${new Date().toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
            </div>
        </div>
        
        <div class="footer">
            <p>This feedback was submitted through the Dumb Rent NYC website.</p>
            <p>Please respond to ${email} if follow-up is needed and permitted.</p>
        </div>
    </div>
</body>
</html>
    `

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Dumb Rent NYC <onboarding@resend.dev>',
        to: ['info@dumbrent.com'],
        subject: `[Feedback] ${category}: ${subject}`,
        html: emailContent,
        reply_to: email,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      throw new Error(`Failed to send email: ${errorData}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ success: true, message: 'Feedback email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending feedback email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})