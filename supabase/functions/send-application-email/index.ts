import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ApplicationEmailRequest {
  tenantName: string
  tenantEmail: string
  listingTitle: string
  listingAddress: string
  moveInDate: string
  message?: string
  listingUrl: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      tenantName, 
      tenantEmail, 
      listingTitle, 
      listingAddress, 
      moveInDate, 
      message, 
      listingUrl 
    }: ApplicationEmailRequest = await req.json()

    // Create the email content
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Application Confirmation - Dumb Rent NYC</title>
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
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 24px; 
            font-weight: bold; 
        }
        .header p { 
            margin: 10px 0 0 0; 
            opacity: 0.9; 
            font-size: 16px; 
        }
        .content { 
            padding: 30px; 
        }
        .confirmation-box {
            background: #f0f9ff;
            border: 2px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
            text-align: center;
        }
        .confirmation-box h2 {
            color: #0ea5e9;
            margin: 0 0 10px 0;
            font-size: 20px;
        }
        .listing-details {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .label {
            font-weight: bold;
            color: #4f46e5;
        }
        .value {
            color: #374151;
        }
        .message-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
        }
        .next-steps {
            background: #ecfdf5;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .next-steps h3 {
            color: #059669;
            margin: 0 0 15px 0;
        }
        .next-steps ul {
            margin: 0;
            padding-left: 20px;
        }
        .next-steps li {
            margin-bottom: 8px;
            color: #374151;
        }
        .button {
            display: inline-block;
            background: #4f46e5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
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
            <h1>Application Submitted Successfully!</h1>
            <p>Your rental application has been received</p>
        </div>
        
        <div class="content">
            <div class="confirmation-box">
                <h2>✅ Application Confirmed</h2>
                <p>Hi ${tenantName}, your application has been successfully submitted and is now under review.</p>
            </div>

            <h3>Application Details</h3>
            <div class="listing-details">
                <div class="detail-row">
                    <span class="label">Property:</span>
                    <span class="value">${listingTitle}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Address:</span>
                    <span class="value">${listingAddress}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Desired Move-in Date:</span>
                    <span class="value">${new Date(moveInDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Application Date:</span>
                    <span class="value">${new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span>
                </div>
            </div>

            ${message ? `
            <div class="message-box">
                <strong>Your Message to the Landlord:</strong>
                <p style="margin: 10px 0 0 0;">${message}</p>
            </div>
            ` : ''}

            <div class="next-steps">
                <h3>What Happens Next?</h3>
                <ul>
                    <li>The landlord will review your application within 2-3 business days</li>
                    <li>You'll receive an email notification when there's an update</li>
                    <li>You can track your application status in your Dumb Rent NYC profile</li>
                    <li>If approved, the landlord will contact you directly to arrange next steps</li>
                </ul>
            </div>

            <div style="text-align: center;">
                <a href="${listingUrl}" class="button">View Listing</a>
                <a href="${listingUrl.replace('/listing/', '/profile?tab=applications')}" class="button" style="background: #059669; margin-left: 10px;">Track Application</a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                <strong>Important:</strong> Please keep this email for your records. If you have any questions about your application, 
                you can reply to this email or contact us through your Dumb Rent NYC profile.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Dumb Rent NYC</strong></p>
            <p>Find your perfect NYC apartment without the dumb broker fee</p>
            <p>This is an automated confirmation email. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
    `

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured, skipping email send')
      return new Response(
        JSON.stringify({ success: true, message: 'Application processed (email disabled)' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Dumb Rent NYC <onboarding@resend.dev>',
        to: [tenantEmail],
        subject: `Application Confirmed: ${listingTitle}`,
        html: emailContent,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Failed to send email:', errorData)
      // Don't fail the entire request if email fails
      return new Response(
        JSON.stringify({ success: true, message: 'Application processed (email failed)' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    const emailResult = await emailResponse.json()
    console.log('Application confirmation email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ success: true, message: 'Application confirmation email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending application confirmation email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})