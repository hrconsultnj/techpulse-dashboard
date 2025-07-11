interface N8NWorkflowConfig {
  webhookUrl: string
  enabled: boolean
  retryAttempts: number
  timeoutMs: number
}

interface N8NWebhookEndpoints {
  userSignup: N8NWorkflowConfig
  marketingEmail: N8NWorkflowConfig
  crmContact: N8NWorkflowConfig
  customerSupport: N8NWorkflowConfig
  analytics: N8NWorkflowConfig
}

// N8N webhook configuration
export const n8nConfig: N8NWebhookEndpoints = {
  userSignup: {
    webhookUrl: import.meta.env.VITE_N8N_USER_SIGNUP_WEBHOOK || '',
    enabled: import.meta.env.VITE_N8N_USER_SIGNUP_ENABLED === 'true',
    retryAttempts: 3,
    timeoutMs: 10000
  },
  
  marketingEmail: {
    webhookUrl: import.meta.env.VITE_N8N_MARKETING_EMAIL_WEBHOOK || '',
    enabled: import.meta.env.VITE_N8N_MARKETING_EMAIL_ENABLED === 'true',
    retryAttempts: 2,
    timeoutMs: 8000
  },
  
  crmContact: {
    webhookUrl: import.meta.env.VITE_N8N_CRM_CONTACT_WEBHOOK || '',
    enabled: import.meta.env.VITE_N8N_CRM_CONTACT_ENABLED === 'true',
    retryAttempts: 3,
    timeoutMs: 12000
  },
  
  customerSupport: {
    webhookUrl: import.meta.env.VITE_N8N_CUSTOMER_SUPPORT_WEBHOOK || '',
    enabled: import.meta.env.VITE_N8N_CUSTOMER_SUPPORT_ENABLED === 'true',
    retryAttempts: 2,
    timeoutMs: 15000
  },
  
  analytics: {
    webhookUrl: import.meta.env.VITE_N8N_ANALYTICS_WEBHOOK || '',
    enabled: import.meta.env.VITE_N8N_ANALYTICS_ENABLED === 'true',
    retryAttempts: 1,
    timeoutMs: 5000
  }
}

// Environment variable defaults
export const defaultConfig = {
  baseUrl: import.meta.env.VITE_N8N_BASE_URL || 'https://n8n.techpulse.ai',
  apiKey: import.meta.env.VITE_N8N_API_KEY || '',
  enabled: import.meta.env.VITE_N8N_ENABLED !== 'false', // Default to true
  debug: import.meta.env.VITE_N8N_DEBUG === 'true'
}

export type { N8NWorkflowConfig, N8NWebhookEndpoints }