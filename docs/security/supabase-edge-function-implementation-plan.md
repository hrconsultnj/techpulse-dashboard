# Detailed Implementation Plan: Supabase Edge Function for Secure Transcription

**Date**: July 10, 2025  
**Priority**: High - Security Vulnerability  
**Status**: Planning Phase

## 🚨 **Security Problem Identified**

### **Current Vulnerability**
- **OpenAI API Key Exposed**: Visible in browser Network tab
- **Location**: Authorization header in frontend requests
- **Risk Level**: Critical - API key can be stolen and abused
- **Evidence**: Screenshot shows `Authorization: Bearer sk-proj-mjX8eQu8LlmY7v0Bu2YiBm1SqzT0OtEDig42...`

### **Impact Analysis**
- ⚠️ **Financial Risk**: Unauthorized API usage charges
- ⚠️ **Security Risk**: API key theft and abuse
- ⚠️ **Compliance Risk**: Violates security best practices

---

## 🔍 **Analysis of Existing Solutions**

### **Imported Assets Approach** (`assets-review/imported-assets/app/api/transcribe/route.ts`)

**What They Used:**
```typescript
// Next.js API Route with Vercel AI SDK
import { experimental_transcribe as transcribe } from "ai"
import { openai } from "@ai-sdk/openai"

const result = await transcribe({
  model: openai.transcription("whisper-1"),
  audio: audioData,
  providerOptions: {
    openai: {
      language: "en",
      temperature: 0.2,
    },
  },
})
```

**Why This Worked:**
- ✅ **Server-side execution** (Next.js API route)
- ✅ **API key hidden** in server environment
- ✅ **AI SDK abstraction** for better error handling
- ✅ **Type safety** with structured responses

**Why We Can't Use It Directly:**
- ❌ **Next.js specific** (we use Vite + React)
- ❌ **App directory structure** not available in Vite
- ❌ **Different build system** and routing

---

## 🏗️ **Proposed Architecture Solutions**

### **Option 1: Supabase Edge Functions** ⭐ **RECOMMENDED**

**Architecture:**
```
🎙️ Frontend → 🔒 Supabase Edge Function → 🤖 OpenAI Whisper API
                    (API key secure)
```

**Advantages:**
- ✅ **Already using Supabase** (no new infrastructure)
- ✅ **Global edge deployment** (fast worldwide)
- ✅ **TypeScript support** (same language)
- ✅ **Built-in authentication** with Supabase
- ✅ **Auto-scaling** and serverless

**Implementation Complexity:** Low (15-20 minutes)

### **Option 2: Express.js Backend Server**

**Architecture:**
```
🎙️ Frontend → 🚀 Express.js Server → 🤖 OpenAI Whisper API
                    (API key secure)
```

**Advantages:**
- ✅ **Full control** over backend logic
- ✅ **Can use AI SDK** like imported assets
- ✅ **Familiar Node.js** environment
- ✅ **Easy to extend** with more features

**Disadvantages:**
- ❌ **Additional infrastructure** to manage
- ❌ **Deployment complexity** (server hosting)
- ❌ **Scaling concerns** (manual server management)

**Implementation Complexity:** Medium (30-45 minutes)

### **Option 3: Serverless Functions** (Vercel/Netlify)

**Architecture:**
```
🎙️ Frontend → ☁️ Serverless Function → 🤖 OpenAI Whisper API
                     (API key secure)
```

**Advantages:**
- ✅ **No server management** (fully serverless)
- ✅ **Auto-scaling** built-in
- ✅ **Can use AI SDK** approach
- ✅ **Easy deployment** with git integration

**Disadvantages:**
- ❌ **Additional service dependency**
- ❌ **Potential cold starts** (slight delay)
- ❌ **Vendor lock-in** concerns

**Implementation Complexity:** Medium (25-35 minutes)

---

## 🎯 **Recommended Solution: Supabase Edge Functions**

### **Why Supabase Edge Functions:**
1. **Existing Infrastructure**: Already using Supabase
2. **Security**: API key completely hidden server-side
3. **Performance**: Global edge deployment
4. **Simplicity**: Minimal additional setup required
5. **Cost**: Included in Supabase plan

---

## 📋 **Detailed Implementation Plan**

### **Phase 1: Project Setup** (5 minutes)

#### **1.1 Install Supabase CLI**
```bash
npm install -g supabase
supabase login
```

#### **1.2 Initialize Supabase Functions**
```bash
supabase functions new transcribe-audio
```

#### **1.3 Project Structure Changes**
```
📁 Project Root
├── supabase/
│   ├── functions/
│   │   └── transcribe-audio/
│   │       └── index.ts          # 🆕 Edge Function
│   ├── config.toml               # 🆕 Supabase config
│   └── .env                      # 🆕 Server environment
├── src/
│   └── services/
│       └── transcriptionService.ts  # 🔄 Modified
└── .env                          # 🔄 Modified (remove API key)
```

---

### **Phase 2: Create Edge Function** (5 minutes)

#### **2.1 Create Function File**: `supabase/functions/transcribe-audio/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get OpenAI API key from server environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Parse form data with audio file
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      throw new Error('No audio file provided')
    }

    // Validate file size (25MB limit)
    if (audioFile.size > 25 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 25MB')
    }

    // Call OpenAI Whisper API
    const transcriptionFormData = new FormData()
    transcriptionFormData.append('file', audioFile)
    transcriptionFormData.append('model', 'whisper-1')
    transcriptionFormData.append('language', 'en')
    transcriptionFormData.append('temperature', '0.2')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: transcriptionFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`)
    }

    const result = await response.json()

    return new Response(
      JSON.stringify({
        text: result.text,
        language: result.language,
        duration: result.duration,
        confidence: 1.0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Transcription failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
```

#### **2.2 Configure Environment Variables**

**Server-side** (Supabase Dashboard):
```bash
# Add to Supabase Project Settings → Edge Functions → Environment Variables
OPENAI_API_KEY=sk-proj-mjX8eQu8LlmY7v0Bu2YiBm1SqzT0OtEDig42...
```

---

### **Phase 3: Update Frontend** (5 minutes)

#### **3.1 Modify `src/services/transcriptionService.ts`**

**REMOVE** (Current - Insecure):
```typescript
// ❌ Remove this method
private async callOpenAIAPI(audioFile: File): Promise<TranscriptionResult> {
  const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY // EXPOSED!
  // ... direct OpenAI API call
}
```

**ADD** (New - Secure):
```typescript
// ✅ Add this method
private async callSupabaseFunction(audioFile: File): Promise<TranscriptionResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const formData = new FormData()
  formData.append('audio', audioFile)

  const response = await fetch(`${supabaseUrl}/functions/v1/transcribe-audio`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.details || errorData.error || 'Transcription failed')
  }

  return response.json()
}
```

**UPDATE** (Main method):
```typescript
async transcribeAudio(audioFile: File): Promise<TranscriptionResult> {
  const validation = this.validateAudioFile(audioFile)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  try {
    // ✅ Call secure Supabase Edge Function
    return await this.callSupabaseFunction(audioFile)
  } catch (error) {
    console.error('Transcription service error:', error)
    throw error instanceof Error ? error : new Error('Unknown transcription error')
  }
}
```

#### **3.2 Update Environment Variables**

**REMOVE from `.env`:**
```bash
# ❌ REMOVE - Security risk
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-mjX8eQu8LlmY7v0Bu2YiBm1SqzT0OtEDig42...
```

**KEEP in `.env`** (these are safe):
```bash
# ✅ KEEP - Public URLs, safe to expose
NEXT_PUBLIC_SUPABASE_URL=https://fcqejcrxtrqdxybgyueu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

### **Phase 4: Testing & Deployment** (5 minutes)

#### **4.1 Local Testing**
```bash
# Start Supabase functions locally
supabase functions serve --env-file supabase/.env

# Test function with curl
curl -X POST http://localhost:54321/functions/v1/transcribe-audio \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -F "audio=@test-audio.webm"
```

#### **4.2 Deploy to Supabase**
```bash
# Deploy function to production
supabase functions deploy transcribe-audio
```

#### **4.3 Frontend Integration Testing**
- Test voice recording → transcription flow
- Verify Network tab shows only Supabase calls
- Check error handling for various scenarios

---

### **Phase 5: Documentation Updates** (5 minutes)

#### **5.1 Update Technical Documentation**
- **File**: `docs/technical/API_INTEGRATIONS.md`
- **Changes**: Add Supabase Edge Function section
- **Include**: Architecture diagram and implementation details

#### **5.2 Update Development Log**
- **File**: `docs/ai-development/DEVELOPMENT_LOG.md`
- **Changes**: Add security improvement entry
- **Include**: Before/after comparison and reasoning

#### **5.3 Update Main Instructions**
- **File**: `CLAUDE.md`
- **Changes**: Update transcription implementation details
- **Include**: New security architecture

---

## 🔐 **Security Improvements**

### **Before (Vulnerable)**
```
Browser Network Tab:
❌ Authorization: Bearer sk-proj-mjX8eQu8LlmY7v0Bu2YiBm1SqzT0OtEDig42...
❌ URL: https://api.openai.com/v1/audio/transcriptions
❌ Method: POST (direct to OpenAI)
```

### **After (Secure)**
```
Browser Network Tab:
✅ Authorization: Bearer eyJhbGciOiJIUzI1NiIs... (Supabase anon key - safe)
✅ URL: https://your-project.supabase.co/functions/v1/transcribe-audio
✅ Method: POST (to secure Edge Function)
```

**API Key Status:**
- ❌ **Before**: Visible in browser, can be stolen
- ✅ **After**: Hidden on server, completely secure

---

## 📊 **Performance Impact Analysis**

### **Expected Changes:**
- **Latency**: +50-100ms (one additional hop)
- **Reliability**: Same or better (Supabase global CDN)
- **Scalability**: Better (serverless auto-scaling)
- **Cost**: Minimal (included in Supabase plan)

### **User Experience:**
- ✅ **No visible changes** to UI/UX
- ✅ **Same recording flow** and auto-transcription
- ✅ **Same error handling** and feedback
- ✅ **Better security** (hidden API key)

---

## 🔧 **Alternative Implementation: AI SDK Approach**

### **Option: Use Vercel AI SDK in Edge Function**

If we want to match the imported assets approach more closely:

#### **Install AI SDK in Edge Function:**
```typescript
// In supabase/functions/transcribe-audio/index.ts
import { experimental_transcribe as transcribe } from "npm:ai"
import { openai } from "npm:@ai-sdk/openai"

// Use AI SDK approach (similar to imported assets)
const result = await transcribe({
  model: openai.transcription("whisper-1"),
  audio: audioData,
  providerOptions: {
    openai: {
      language: "en",
      temperature: 0.2,
    },
  },
})
```

**Advantages:**
- ✅ **Same approach** as imported assets
- ✅ **Better error handling** with AI SDK
- ✅ **Type safety** improvements

**Disadvantages:**
- ❌ **Additional dependency** in Edge Function
- ❌ **Deno compatibility** may require different imports
- ❌ **More complex** than direct API calls

**Recommendation**: Start with direct API calls (simpler), can upgrade to AI SDK later if needed.

---

## ✅ **Success Criteria**

### **Security Goals:**
- ✅ **API key not visible** in browser Network tab
- ✅ **Only Supabase URLs** visible in browser requests
- ✅ **OpenAI API key** only exists on server

### **Functionality Goals:**
- ✅ **Transcription works** exactly as before
- ✅ **Error handling** maintains same UX
- ✅ **Performance** acceptable (< 3 seconds total)

### **Documentation Goals:**
- ✅ **Architecture updated** in all docs
- ✅ **Security improvement** logged
- ✅ **Future AI assistants** understand new structure

---

## 🚨 **Rollback Plan**

### **If Implementation Fails:**
1. **Revert frontend changes** (git checkout)
2. **Re-add API key** to `.env` temporarily
3. **Debug Edge Function** separately
4. **Use Express.js** as backup plan

### **Backup Files:**
- Keep current `transcriptionService.ts` as `transcriptionService.backup.ts`
- Commit each phase separately for easy rollback

---

## 📋 **Implementation Checklist**

### **Phase 1: Setup**
- [ ] Install Supabase CLI
- [ ] Initialize functions in project
- [ ] Create folder structure

### **Phase 2: Edge Function**
- [ ] Create function file with OpenAI integration
- [ ] Configure server environment variables
- [ ] Test function locally

### **Phase 3: Frontend**
- [ ] Update transcriptionService.ts
- [ ] Remove API key from frontend .env
- [ ] Test integration end-to-end

### **Phase 4: Security Verification**
- [ ] Check Network tab (no OpenAI API key visible)
- [ ] Verify transcription still works
- [ ] Test error scenarios

### **Phase 5: Documentation**
- [ ] Update technical docs
- [ ] Update development log
- [ ] Update CLAUDE.md

---

## 🎯 **Next Steps**

**Ready for Implementation**: This plan provides a complete roadmap for securing the transcription functionality while maintaining all existing features.

**Estimated Total Time**: 25-30 minutes  
**Risk Level**: Low (easy rollback available)  
**Security Impact**: High (completely eliminates API key exposure)

---

*This document serves as the complete implementation guide for moving transcription to a secure server-side implementation using Supabase Edge Functions.*