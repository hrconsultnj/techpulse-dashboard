# API Integrations Documentation

## 🎤 OpenAI Whisper Integration

### **Overview**
Direct frontend integration with OpenAI's Whisper API for real-time voice transcription.

### **Architecture**
```
🎙️ Browser MediaRecorder → 🎵 WebM/Opus Blob → 📡 OpenAI Whisper API → 📝 Transcribed Text
```

### **Implementation Files**
- **Service**: `src/services/transcriptionService.ts`
- **Hook**: `src/hooks/useAudioRecording.ts`
- **Component**: `src/components/SynthChatInterface.tsx`

### **Configuration**

#### **Environment Variables**
```bash
# Required - Get from: https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=sk-proj-your-key-here

# Optional - Model configuration
VITE_WHISPER_MODEL=whisper-1
```

#### **Audio Format Settings**
```javascript
// MediaRecorder Configuration
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
    ? 'audio/webm;codecs=opus' 
    : 'audio/webm'
})

// OpenAI API Parameters
formData.append('model', 'whisper-1')
formData.append('language', 'en')
formData.append('temperature', '0.2')
```

### **API Call Implementation**

#### **Direct Fetch to OpenAI**
```javascript
const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${openaiApiKey}`,
  },
  body: formData, // Contains the audio file
})
```

#### **Response Format**
```javascript
{
  text: "The transcribed audio text",
  language: "en",
  duration: 5.2,
  confidence: 1.0
}
```

### **Error Handling**

#### **Common Issues & Solutions**
1. **API Key Not Configured**
   - Error: "OpenAI API key not configured"
   - Solution: Set `VITE_OPENAI_API_KEY` in `.env`

2. **Unsupported File Format**
   - Error: "Unsupported file format: audio/webm;codecs=opus"
   - Solution: Enhanced validation handles codec variants

3. **File Size Too Large**
   - Error: "File size too large. Maximum size is 25MB"
   - Solution: Recordings auto-stop after 5 minutes

### **Performance Metrics**
- **Response Time**: ~1-2 seconds for typical recordings
- **File Size**: 8-15KB for 5-10 second clips (WebM/Opus)
- **Accuracy**: Excellent for clear speech in English
- **Rate Limits**: Standard OpenAI API limits apply

---

## 🔄 N8N Workflow Automation

### **Overview**
Webhook-based automation system that triggers workflows in N8N when users sign up.

### **Architecture**
```
📝 User Signup → 🚀 3 Parallel Webhooks → 📧 Marketing + 👤 CRM + 🔄 Automation
```

### **Implementation Files**
- **Service**: `src/services/n8nWebhooks.ts`
- **Config**: `src/config/n8nConfig.ts`
- **Integration**: `src/hooks/useAuth.ts` (in signup function)

### **Webhook Endpoints**

#### **Environment Variables**
```bash
# N8N Base Configuration
VITE_N8N_ENABLED=true
VITE_N8N_DEBUG=false
VITE_N8N_BASE_URL=https://n8n.techpulse.ai
VITE_N8N_API_KEY=your_n8n_api_key

# Webhook URLs
VITE_N8N_USER_SIGNUP_WEBHOOK=https://n8n.techpulse.ai/webhook/user-signup
VITE_N8N_MARKETING_EMAIL_WEBHOOK=https://n8n.techpulse.ai/webhook/marketing-email
VITE_N8N_CRM_CONTACT_WEBHOOK=https://n8n.techpulse.ai/webhook/crm-contact
VITE_N8N_CUSTOMER_SUPPORT_WEBHOOK=https://n8n.techpulse.ai/webhook/customer-support
VITE_N8N_ANALYTICS_WEBHOOK=https://n8n.techpulse.ai/webhook/analytics
```

### **Webhook Payloads**

#### **1. User Signup Webhook**
```javascript
{
  type: 'user_signup',
  data: {
    userId: 'uuid-string',
    email: 'user@example.com',
    fullName: 'John Doe',
    role: 'customer',
    companyName: 'Acme Corp',
    phone: '+1234567890',
    metadata: {
      signupDate: '2025-07-10T18:30:00.000Z',
      userAgent: 'Mozilla/5.0...',
      referrer: 'https://google.com',
      platform: 'web'
    }
  },
  timestamp: '2025-07-10T18:30:00.000Z',
  source: 'techpulse-dashboard'
}
```

#### **2. Marketing Email Webhook**
```javascript
{
  type: 'marketing_email',
  data: {
    email: 'user@example.com',
    fullName: 'John Doe',
    tags: ['new_user', 'customer'],
    customFields: {
      companyName: 'Acme Corp',
      phone: '+1234567890',
      signupDate: '2025-07-10T18:30:00.000Z'
    }
  },
  timestamp: '2025-07-10T18:30:00.000Z',
  source: 'techpulse-dashboard'
}
```

#### **3. CRM Contact Webhook**
```javascript
{
  type: 'crm_contact',
  data: {
    email: 'user@example.com',
    fullName: 'John Doe',
    companyName: 'Acme Corp',
    phone: '+1234567890',
    leadSource: 'techpulse_signup',
    properties: {
      role: 'customer',
      signupDate: '2025-07-10T18:30:00.000Z',
      platform: 'web'
    }
  },
  timestamp: '2025-07-10T18:30:00.000Z',
  source: 'techpulse-dashboard'
}
```

### **Implementation Details**

#### **Non-blocking Design**
```javascript
try {
  await Promise.all([
    n8nWebhooks.triggerUserSignup(signupData),
    n8nWebhooks.triggerMarketingEmail(marketingData),
    n8nWebhooks.triggerCRMContact(crmData)
  ])
} catch (webhookError) {
  console.error('Webhook automation failed:', webhookError)
  // Don't fail the signup process if webhooks fail
}
```

#### **Retry Logic & Error Handling**
```javascript
// Config per webhook type
{
  retryAttempts: 3,
  timeoutMs: 10000
}
```

### **N8N Workflow Setup**

#### **Required N8N Nodes**
1. **Webhook Trigger**: Receives POST requests from TechPulse
2. **Data Processing**: Extracts and validates payload data
3. **Conditional Logic**: Routes based on webhook type
4. **External Service Connectors**: 
   - Email marketing platforms (Mailchimp, ConvertKit, etc.)
   - CRM systems (HubSpot, Salesforce, etc.)
   - Analytics tools (Google Analytics, Mixpanel, etc.)

#### **Example N8N Workflow Structure**
```
Webhook → Data Validator → Router
                         ├─ Marketing Email → Mailchimp
                         ├─ CRM Contact → HubSpot
                         └─ Analytics → Google Analytics
```

### **Testing & Debugging**

#### **Enable Debug Mode**
```bash
VITE_N8N_DEBUG=true
```

#### **Console Logs**
- Webhook payloads sent
- Response status codes
- Error details for failed requests

#### **N8N Webhook Testing**
1. Use N8N's built-in webhook testing
2. Check execution logs in N8N interface
3. Verify data flow through workflow nodes

---

## 🔧 Troubleshooting Guide

### **OpenAI Whisper Issues**

#### **1. API Key Problems**
```bash
# Error: "OpenAI API key not configured"
# Solution: Check .env file
VITE_OPENAI_API_KEY=sk-proj-your-actual-key

# Restart dev server after changing .env
npm run dev
```

#### **2. Audio Format Issues**
```javascript
// Error: "Unsupported file format"
// Check MediaRecorder support
console.log('WebM supported:', MediaRecorder.isTypeSupported('audio/webm'))
console.log('Opus supported:', MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))
```

#### **3. Large File Errors**
```javascript
// Error: "File size too large"
// Check recording duration and file size
console.log('File size:', audioFile.size, 'bytes')
console.log('Max allowed:', 25 * 1024 * 1024, 'bytes') // 25MB
```

### **N8N Webhook Issues**

#### **1. Webhook Not Triggering**
```bash
# Check webhook URL configuration
echo $VITE_N8N_USER_SIGNUP_WEBHOOK

# Test webhook manually
curl -X POST https://n8n.techpulse.ai/webhook/user-signup \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

#### **2. Enable Debug Logging**
```bash
# In .env
VITE_N8N_DEBUG=true

# Check browser console for detailed logs
```

#### **3. Network/CORS Issues**
- Ensure N8N webhooks allow cross-origin requests
- Check network tab in browser dev tools
- Verify webhook URLs are accessible

### **General Development Issues**

#### **1. Environment Variables Not Loading**
```bash
# Restart dev server after .env changes
npm run dev

# Check if variables are loaded
console.log('OpenAI Key configured:', !!import.meta.env.VITE_OPENAI_API_KEY)
```

#### **2. Build Errors**
```bash
# Check TypeScript errors
npm run build

# Most Supabase errors are non-blocking
# Focus on errors in transcription/webhook files
```

---

## 📚 Additional Resources

### **OpenAI Documentation**
- [Whisper API Reference](https://platform.openai.com/docs/api-reference/audio)
- [Audio File Formats](https://platform.openai.com/docs/guides/speech-to-text)
- [Rate Limits](https://platform.openai.com/account/rate-limits)

### **N8N Documentation**
- [Webhook Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [Workflow Examples](https://n8n.io/workflows/)

### **Web APIs**
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

---
*Last updated: July 10, 2025*