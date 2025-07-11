export async function POST(req: Request) {
  try {
    console.log("=== Webhook Proxy Called ===")

    // Get the actual n8n webhook URL from query params or headers
    const { searchParams } = new URL(req.url)
    const webhookType = searchParams.get('type') || 'default'
    
    // Map webhook types to environment variables
    const webhookUrls: Record<string, string | undefined> = {
      'user-signup': process.env.NEXT_PUBLIC_N8N_USER_SIGNUP_WEBHOOK,
      'marketing-email': process.env.NEXT_PUBLIC_N8N_MARKETING_EMAIL_WEBHOOK,
      'crm-contact': process.env.NEXT_PUBLIC_N8N_CRM_CONTACT_WEBHOOK,
      'customer-support': process.env.NEXT_PUBLIC_N8N_CUSTOMER_SUPPORT_WEBHOOK,
      'analytics': process.env.NEXT_PUBLIC_N8N_ANALYTICS_WEBHOOK,
    }

    const n8nWebhookUrl = webhookUrls[webhookType]

    if (!n8nWebhookUrl) {
      console.error(`N8N webhook URL not configured for type: ${webhookType}`)
      return Response.json({ error: "Webhook URL not configured" }, { status: 500 })
    }

    // Forward the request to n8n
    const body = await req.text()

    console.log("Forwarding to n8n:", n8nWebhookUrl)
    console.log("Request body length:", body.length)

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        'Content-Type': req.headers.get('Content-Type') || 'application/json',
      },
      body: body,
    })

    console.log("N8N response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("N8N error response:", errorText)
      throw new Error(`N8N webhook failed: ${response.status} ${errorText}`)
    }

    // Try to parse JSON response
    const contentType = response.headers.get("content-type")
    let result

    if (contentType?.includes("application/json")) {
      result = await response.json()
    } else {
      const textResponse = await response.text()
      result = { response: textResponse }
    }

    console.log("N8N response:", result)

    // Return the response from n8n
    return Response.json(result)
  } catch (error) {
    console.error("Webhook proxy error:", error)

    return Response.json(
      {
        response: "I'm having trouble connecting to the backend service. Please try again in a moment.",
        error: "Webhook proxy failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return Response.json({
    message: "TechPulse Webhook Proxy",
    status: "active",
    availableTypes: [
      'user-signup',
      'marketing-email', 
      'crm-contact',
      'customer-support',
      'analytics'
    ],
  })
}