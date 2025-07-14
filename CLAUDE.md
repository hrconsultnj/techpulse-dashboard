# CLAUDE.md - AI Assistant Context & Instructions

## 📊 Project Overview
**TechPulse Dashboard** - A sophisticated automotive service chat interface with voice transcription and workflow automation.

## 🏗️ Current Architecture

### **Frontend Stack**
- **Framework**: Next.js 15 + React + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components in `src/components/ui/`
- **Key Features**: Voice recording, real-time transcription, N8N workflow automation

### **Backend Integrations**
- **Authentication**: Supabase (configured and schema corrected)
- **Voice Transcription**: OpenAI Whisper API (direct frontend integration)
- **Workflow Automation**: N8N webhooks for user signup, marketing, and CRM

### **Database Schema** ✅ **UPDATED - July 14, 2025**
- **`user_profiles`** - User profiles table with full fields (role, company_name, phone, etc.)
- **`chat_messages`** - Chat message storage
- **`conversation_threads`** - Chat thread management (no `user_id` or `title` columns)
- **`knowledge_base`** - AI knowledge base for responses

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
NEXT_PUBLIC_SUPABASE_URL=https://fcqejcrxtrqdxybgyueu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Whisper (Voice Transcription)
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-mjX8eQu8LlmY7v0Bu2YiBm1SqzT0OtEDig42...
NEXT_PUBLIC_WHISPER_MODEL=whisper-1

# N8N Workflow Automation
NEXT_PUBLIC_N8N_ENABLED=true
NEXT_PUBLIC_N8N_USER_SIGNUP_WEBHOOK=https://n8n.techpulse.ai/webhook/user-signup
NEXT_PUBLIC_N8N_MARKETING_EMAIL_WEBHOOK=https://n8n.techpulse.ai/webhook/marketing-email
NEXT_PUBLIC_N8N_CRM_CONTACT_WEBHOOK=https://n8n.techpulse.ai/webhook/crm-contact
# ... (see .env for full list)
```

## ✅ RECENTLY FIXED - July 14, 2025

### **Database Migration to user_profiles**
- **Issue**: Consolidated profiles and user_profiles tables into single user_profiles table
- **Impact**: Full user profile fields now available (role, company_name, phone, etc.)
- **Status**: ✅ COMPLETED - All code updated to use user_profiles
- **Files Updated**: `database.types.ts`, `supabase-server.ts`, `useAuth.ts`, `supabase.ts`
- **Deprecated**: Old `profiles` table (minimal schema)

### **Conversation Threads Schema**
- **Issue**: Code expected `user_id` and `title` columns that don't exist
- **Impact**: Thread management API failures
- **Status**: ✅ FIXED - Updated to use metadata for user_id
- **Note**: User ID stored in `metadata.user_id` field

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

**Last Updated**: July 14, 2025  
**Current Phase**: Database migration to user_profiles completed - full profile features available  
**Next Priorities**: Based on user requests

### **Recent Changes**
- ✅ Completed migration from Vite to Next.js 15 with App Router
- ✅ Updated all environment variables from VITE_ to NEXT_PUBLIC_ prefix
- ✅ Migrated database to use `user_profiles` table with full schema
- ✅ Updated all TypeScript types to match consolidated database structure
- ✅ Corrected API routes to use proper table names
- ✅ Fixed conversation threads to use metadata for user association
- ✅ Deprecated old `profiles` table in favor of complete `user_profiles`

## 📞 Emergency Contacts & Resources

- **OpenAI API Docs**: https://platform.openai.com/docs/api-reference/audio
- **N8N Webhook Docs**: https://docs.n8n.io/webhooks/
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---
*This file should be updated whenever significant architectural changes are made.*