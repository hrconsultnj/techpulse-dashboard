# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

If that fails, try clearing cache and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your API credentials:
```bash
# Supabase (Authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Whisper (Voice Transcription) - REQUIRED
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-your-openai-api-key

# N8N Workflows (Optional)
NEXT_PUBLIC_N8N_ENABLED=true
NEXT_PUBLIC_N8N_USER_SIGNUP_WEBHOOK=https://your-n8n.com/webhook/user-signup
NEXT_PUBLIC_N8N_MARKETING_EMAIL_WEBHOOK=https://your-n8n.com/webhook/marketing-email
NEXT_PUBLIC_N8N_CRM_CONTACT_WEBHOOK=https://your-n8n.com/webhook/crm-contact
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm run start
```

## Project Structure Explained

### App Directory (Next.js 15 App Router)
- `src/app/` - Next.js app directory with App Router
- `src/app/page.tsx` - Home page
- `src/app/login/page.tsx` - Login page
- `src/app/register/page.tsx` - Registration page
- `src/app/dashboard/page.tsx` - Main dashboard
- `src/app/chat/page.tsx` - Chat interface
- `src/app/api/` - API routes

### Components
- `src/components/layout/` - Header, Sidebar, Footer
- `src/components/ui/` - Reusable UI components
- `src/components/SynthChatInterface.tsx` - Main chat interface

### Services
- `src/services/supabase.ts` - Supabase integration
- `src/services/transcriptionService.ts` - OpenAI Whisper integration
- `src/services/n8nWebhooks.ts` - N8N workflow automation
- `src/services/chatService.ts` - Chat functionality

### Hooks
- `src/hooks/useAuth.ts` - Authentication state management
- `src/hooks/useAudioRecording.ts` - Voice recording logic

### Configuration
- `src/lib/` - Database types and server utilities
- `src/config/` - Application configuration

## Key Features Setup

### Voice Transcription
1. **Required**: OpenAI API key in environment variables
2. **Browser Permissions**: Microphone access required
3. **Testing**: Click microphone in chat interface
4. **Quality**: Uses WebM/Opus codec for best results

### N8N Workflow Automation
1. **Optional**: Set up N8N instance
2. **Webhooks**: Configure webhook URLs in environment
3. **Testing**: User registration triggers workflows
4. **Debug**: Enable `NEXT_PUBLIC_N8N_DEBUG=true` for logging

### Authentication
1. **Supabase Setup**: Create project and get credentials
2. **Database Schema**: Use provided schema in `docs/database/`
3. **Testing**: Register new user to test full flow

## Database Schema

You'll need these tables in Supabase:

```sql
-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES conversation_threads(id),
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversation threads
CREATE TABLE conversation_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID,
  interaction_type TEXT DEFAULT 'chat',
  content TEXT,
  ai_response TEXT,
  confidence_score NUMERIC DEFAULT 0.9,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Knowledge base
CREATE TABLE knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Common Issues & Solutions

### Environment Variable Issues
1. **Next.js Requirement**: All public env vars must use `NEXT_PUBLIC_` prefix
2. **Restart Required**: Restart dev server after changing `.env`
3. **Build Errors**: Check all required variables are set

### Voice Transcription Issues
1. **API Key**: Verify `NEXT_PUBLIC_OPENAI_API_KEY` is set correctly
2. **Microphone Permission**: Browser must allow microphone access
3. **Network**: Check browser Network tab for API call errors
4. **File Format**: App uses WebM/Opus - ensure browser support

### Database Connection Issues
1. **Supabase URL**: Check project URL format
2. **RLS Policies**: Ensure Row Level Security policies are configured
3. **Table Names**: Use `profiles` not `user_profiles`
4. **API Keys**: Verify anon key permissions

### Build/TypeScript Issues
1. **Type Errors**: Run `npm run build` to check TypeScript
2. **Missing Types**: Import types from `src/lib/database.types.ts`
3. **ESLint**: Fix linting issues with `npm run lint`

## Development Workflow

1. **Start Development**: `npm run dev`
2. **Test Core Features**: 
   - User registration/login
   - Voice transcription
   - Chat interface
   - N8N workflows (if enabled)
3. **Check Builds**: `npm run build` before committing
4. **Update Documentation**: Add changes to `docs/ai-development/DEVELOPMENT_LOG.md`

## Production Deployment

### Environment Variables
Set these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_OPENAI_API_KEY`
- All N8N webhook URLs (if using automation)

### Build Process
```bash
npm run build
npm run start
```

### Static Export (if needed)
```bash
npm run build
# Configure next.config.js for static export if required
```

## Security Considerations

### OpenAI API Key
⚠️ **CRITICAL**: The OpenAI API key is currently exposed in the frontend. For production:
1. **Implement**: Supabase Edge Function for transcription
2. **Move**: API calls to server-side
3. **Reference**: See `docs/security/supabase-edge-function-implementation-plan.md`

### Environment Variables
- Never commit `.env` file
- Use different keys for development/production
- Rotate keys regularly

## Getting Help

1. **Development Context**: Check `CLAUDE.md` for complete project overview
2. **API Documentation**: See `docs/technical/API_INTEGRATIONS.md`
3. **Progress Tracking**: Review `docs/ai-development/DEVELOPMENT_LOG.md`
4. **Security Plans**: Check `docs/security/` for implementation guides

## Available Scripts

```bash
npm run dev          # Start Next.js development server
npm run build        # Build Next.js app for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Framework Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Tailwind CSS](https://tailwindcss.com/docs)