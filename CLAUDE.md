# CLAUDE.md - AI Assistant Context & Instructions

## 📊 Project Overview
**TechPulse Dashboard** - A sophisticated automotive service chat interface with voice transcription and workflow automation.

## 🏗️ Current Architecture

### **Frontend Stack**
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components in `src/components/ui/`
- **Key Features**: Voice recording, real-time transcription, N8N workflow automation

### **Backend Integrations**
- **Authentication**: Supabase (configured but has some TypeScript issues)
- **Voice Transcription**: OpenAI Whisper API (direct frontend integration)
- **Workflow Automation**: N8N webhooks for user signup, marketing, and CRM

## ✅ Completed Integrations

### **1. OpenAI Whisper Transcription**
- **Status**: ✅ FULLY WORKING
- **Location**: `src/services/transcriptionService.ts` + `src/hooks/useAudioRecording.ts`
- **Features**: 
  - Real-time voice recording with WebM/Opus codec
  - Direct OpenAI API calls (no backend needed)
  - Auto-transcription on recording stop
  - Smart UI state management (fixed infinite loop bug)
  - ChatGPT-style input field with max height and scrolling

### **2. N8N Workflow Automation**
- **Status**: ✅ CONFIGURED
- **Location**: `src/services/n8nWebhooks.ts` + `src/hooks/useAuth.ts`
- **Features**:
  - User signup triggers 3 webhooks: marketing email, CRM contact, user automation
  - Non-blocking (signup succeeds even if webhooks fail)
  - Comprehensive metadata tracking

### **3. Chat Interface**
- **Status**: ✅ FULLY FUNCTIONAL
- **Location**: `src/components/SynthChatInterface.tsx`
- **Features**:
  - Voice recording with visual feedback (red pulsing, spinner, etc.)
  - Auto-transcription integration
  - File attachments support
  - Mobile-responsive design
  - Dark/light mode support

## 🔧 Environment Setup

### **Required Environment Variables**
```bash
# Supabase (Authentication)
VITE_SUPABASE_URL=https://fcqejcrxtrqdxybgyueu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Whisper (Voice Transcription)
VITE_OPENAI_API_KEY=sk-proj-mjX8eQu8LlmY7v0Bu2YiBm1SqzT0OtEDig42...
VITE_WHISPER_MODEL=whisper-1

# N8N Workflow Automation
VITE_N8N_ENABLED=true
VITE_N8N_USER_SIGNUP_WEBHOOK=https://n8n.techpulse.ai/webhook/user-signup
VITE_N8N_MARKETING_EMAIL_WEBHOOK=https://n8n.techpulse.ai/webhook/marketing-email
VITE_N8N_CRM_CONTACT_WEBHOOK=https://n8n.techpulse.ai/webhook/crm-contact
# ... (see .env for full list)
```

## 🚨 Known Issues

### **CRITICAL: OpenAI API Key Exposed in Frontend** 
- **Issue**: OpenAI API key visible in browser Network tab during transcription
- **Impact**: Security vulnerability - API key can be stolen and abused
- **Status**: **URGENT - Implementation plan ready in `docs/security/supabase-edge-function-implementation-plan.md`**
- **Solution**: Move transcription to Supabase Edge Function (server-side)

### **Supabase TypeScript Errors**
- **Issue**: `src/services/supabase.ts` has TypeScript errors related to `GenericStringError`
- **Impact**: Build warnings but doesn't break functionality
- **Status**: Non-blocking, can be fixed later

## 📁 Key File Locations

### **Core Components**
- `src/components/SynthChatInterface.tsx` - Main chat interface
- `src/hooks/useAudioRecording.ts` - Voice recording logic
- `src/services/transcriptionService.ts` - OpenAI Whisper integration
- `src/services/n8nWebhooks.ts` - N8N workflow automation

### **Configuration**
- `.env` - Environment variables (actual values)
- `.env.example` - Environment template
- `src/config/n8nConfig.ts` - N8N webhook configuration

### **Documentation**
- `docs/README.md` - Documentation organization and navigation
- `docs/ai-development/DEVELOPMENT_LOG.md` - Development progress tracking
- `docs/technical/API_INTEGRATIONS.md` - API integration details  
- `docs/security/supabase-edge-function-implementation-plan.md` - Security improvement plan
- `docs/PROJECT_HANDOFF.md` - Existing project documentation
- `docs/SETUP_GUIDE.md` - Setup instructions

## 🎯 Instructions for Future AI Sessions

### **1. First Steps**
1. Read this CLAUDE.md file for context
2. Read `docs/README.md` for documentation organization  
3. Read `docs/ai-development/DEVELOPMENT_LOG.md` for recent progress
4. Read `docs/technical/API_INTEGRATIONS.md` for technical details
5. Check `docs/security/` for any pending security implementations
6. Check `.env` file for current environment configuration

### **2. Development Workflow**
1. **Always test changes**: Run `npm run dev` to test changes
2. **Check builds**: Run `npm run build` to verify TypeScript
3. **Update logs**: Add significant changes to `docs/ai-development/DEVELOPMENT_LOG.md`
4. **Document APIs**: Update `docs/technical/API_INTEGRATIONS.md` for new integrations
5. **Security reviews**: Document security improvements in `docs/security/`

### **3. Key Principles**
- **Voice transcription works perfectly** - don't break the OpenAI integration
- **N8N webhooks are configured** - don't modify unless requested
- **UI follows ChatGPT patterns** - maintain clean, modern interface
- **Environment variables are sensitive** - never expose API keys

### **4. Common Tasks**
- **New features**: Build on existing architecture, update documentation
- **Bug fixes**: Check console logs, test thoroughly, document fixes
- **API changes**: Update both code and `docs/API_INTEGRATIONS.md`
- **UI improvements**: Follow existing Tailwind CSS patterns

## 🔄 Development Status

**Last Updated**: July 10, 2025  
**Current Phase**: Core functionality complete - ready for feature enhancements  
**Next Priorities**: Based on user requests

## 📞 Emergency Contacts & Resources

- **OpenAI API Docs**: https://platform.openai.com/docs/api-reference/audio
- **N8N Webhook Docs**: https://docs.n8n.io/webhooks/
- **Vite Documentation**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs

---
*This file should be updated whenever significant architectural changes are made.*