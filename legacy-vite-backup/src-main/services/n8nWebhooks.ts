interface WebhookPayload {
  type: 'user_signup' | 'marketing_email' | 'crm_contact'
  data: SignupWebhookData | MarketingWebhookData | CRMWebhookData
  timestamp: string
  source: string
}

interface SignupWebhookData {
  userId: string
  email: string
  fullName?: string
  role: string
  companyName?: string
  phone?: string
  metadata?: Record<string, unknown>
}

interface MarketingWebhookData {
  email: string
  fullName?: string
  listId?: string
  tags?: string[]
  customFields?: Record<string, unknown>
}

interface CRMWebhookData {
  email: string
  fullName?: string
  companyName?: string
  phone?: string
  leadSource: string
  properties?: Record<string, unknown>
}

class N8NWebhookService {
  private readonly baseUrl = '/api/webhook-proxy'

  private async sendWebhook(payload: WebhookPayload): Promise<unknown> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async triggerUserSignup(data: SignupWebhookData): Promise<void> {
    const payload: WebhookPayload = {
      type: 'user_signup',
      data,
      timestamp: new Date().toISOString(),
      source: 'techpulse-dashboard'
    }

    try {
      await this.sendWebhook(payload)
      console.log('User signup webhook triggered successfully')
    } catch (error) {
      console.error('Failed to trigger user signup webhook:', error)
      throw error
    }
  }

  async triggerMarketingEmail(data: MarketingWebhookData): Promise<void> {
    const payload: WebhookPayload = {
      type: 'marketing_email',
      data,
      timestamp: new Date().toISOString(),
      source: 'techpulse-dashboard'
    }

    try {
      await this.sendWebhook(payload)
      console.log('Marketing email webhook triggered successfully')
    } catch (error) {
      console.error('Failed to trigger marketing email webhook:', error)
      throw error
    }
  }

  async triggerCRMContact(data: CRMWebhookData): Promise<void> {
    const payload: WebhookPayload = {
      type: 'crm_contact',
      data,
      timestamp: new Date().toISOString(),
      source: 'techpulse-dashboard'
    }

    try {
      await this.sendWebhook(payload)
      console.log('CRM contact webhook triggered successfully')
    } catch (error) {
      console.error('Failed to trigger CRM contact webhook:', error)
      throw error
    }
  }
}

export const n8nWebhooks = new N8NWebhookService()
export type { SignupWebhookData, MarketingWebhookData, CRMWebhookData }