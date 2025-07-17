import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface VerificationEmailRequest {
  email: string
  confirmationUrl: string
  displayName?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, confirmationUrl, displayName }: VerificationEmailRequest = await req.json()

    // Create the email content
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify Your Email - Dumb Rent NYC</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
        }
        .header { 
            background: linear-gradient(135deg, #4f46e5, #4338ca); 
            color: white; 
            padding: 40px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold; 
        }
        .header p { 
            margin: 10px 0 0 0; 
            opacity: 0.9; 
            font-size: 16px; 
        }
        .content { 
            padding: 40px 30px; 
            text-align: center; 
        }
        .welcome { 
            font-size: 18px; 
            color: #4f46e5; 
            margin-bottom: 20px; 
            font-weight: 600; 
        }
        .message { 
            font-size: 16px; 
            color: #666; 
            margin-bottom: 30px; 
            line-height: 1.6; 
        }
        .verify-button { 
            display: inline-block; 
            background: #4f46e5; 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px; 
            margin: 20px 0; 
            transition: background-color 0.3s ease; 
        }
        .verify-button:hover { 
            background: #4338ca; 
        }
        .alternative { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            font-size: 14px; 
            color: #666; 
        }
        .alternative a { 
            color: #4f46e5; 
            word-break: break-all; 
        }
        .footer { 
            background: #f9fafb; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb; 
        }
        .footer p { 
            margin: 5px 0; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Dumb Rent NYC!</h1>
            <p>Your NYC apartment search starts here</p>
        </div>
        
        <div class="content">
            ${displayName ? `<div class="welcome">Hi ${displayName}!</div>` : ''}
            
            <div class="message">
                Thanks for signing up! To complete your account setup and start exploring NYC apartments, 
                please verify your email address by clicking the button below.
            </div>
            
            <a href="${confirmationUrl}" class="verify-button">
                Verify Email Address
            </a>
            
            <div class="message">
                Once verified, you'll be able to:
                <br>• Save your favorite listings
                <br>• Apply to apartments directly
                <br>• Get notifications about new listings
                <br>• Access your personalized dashboard
            </div>
            
            <div class="alternative">
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <a href="${confirmationUrl}">${confirmationUrl}</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Dumb Rent NYC</strong></p>
            <p>Find your perfect NYC apartment without the dumb broker fee</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
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
        to: [email],
        subject: 'Verify your email address - Dumb Rent NYC',
        html: emailContent,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      throw new Error(`Failed to send email: ${errorData}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Verification email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ success: true, message: 'Verification email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending verification email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})