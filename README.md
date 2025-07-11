# TechPulse Dashboard

A sophisticated automotive service chat interface with real-time voice transcription and workflow automation.

## 🎯 Features

### ✅ **Core Features (Working)**
- 🎤 **Voice Transcription**: Real-time OpenAI Whisper integration
- 🔄 **Workflow Automation**: N8N webhook triggers for user actions
- 💬 **Chat Interface**: Modern ChatGPT-style messaging with file attachments
- 📱 **Mobile Responsive**: Optimized for desktop and mobile devices
- 🌙 **Dark/Light Mode**: Theme switching support
- 📎 **File Attachments**: Support for multiple file types

### 🎤 **Voice Transcription System**
- **Real-time Recording**: Browser-based voice capture
- **Auto-transcription**: Automatic speech-to-text on recording stop
- **Smart UI**: Visual feedback with recording indicators and progress
- **Fast Performance**: ~1-2 second transcription response times
- **High Accuracy**: OpenAI Whisper for excellent transcription quality

### 🔄 **N8N Workflow Automation**
- **User Signup Triggers**: Automatic marketing and CRM workflows
- **Non-blocking Design**: Core functionality continues even if webhooks fail
- **Comprehensive Data**: Rich metadata tracking for analytics
- **Parallel Processing**: Multiple workflows triggered simultaneously

## 🏗️ Architecture

### **Frontend Stack**
- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks and context
- **UI Library**: Custom components with Lucide icons

### **Backend Integrations**
- **Authentication**: Supabase (configured)
- **Voice API**: OpenAI Whisper (direct integration)
- **Automation**: N8N webhooks for workflow triggers
- **Database**: Supabase PostgreSQL

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- N8N instance (optional for workflow automation)

### **Installation**
```bash
# Clone and install
git clone <repository-url>
cd techpulse-dashboard
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Setup below)

# Start development server
npm run dev
```

### **Environment Setup**
Copy `.env.example` to `.env` and configure:

```bash
# Supabase (Authentication)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Whisper (Voice Transcription) - REQUIRED
VITE_OPENAI_API_KEY=sk-proj-your-openai-api-key

# N8N Workflows (Optional)
VITE_N8N_ENABLED=true
VITE_N8N_USER_SIGNUP_WEBHOOK=https://your-n8n.com/webhook/user-signup
VITE_N8N_MARKETING_EMAIL_WEBHOOK=https://your-n8n.com/webhook/marketing-email
VITE_N8N_CRM_CONTACT_WEBHOOK=https://your-n8n.com/webhook/crm-contact
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 📁 Project Structure

```
├── CLAUDE.md                    # AI assistant instructions
├── docs/
│   ├── DEVELOPMENT_LOG.md       # Development progress tracking
│   ├── API_INTEGRATIONS.md      # API integration documentation
│   ├── PROJECT_HANDOFF.md       # Project handoff notes
│   └── SETUP_GUIDE.md          # Setup instructions
├── src/
│   ├── components/
│   │   ├── SynthChatInterface.tsx   # Main chat interface
│   │   └── ui/                      # Reusable UI components
│   ├── hooks/
│   │   ├── useAudioRecording.ts     # Voice recording logic
│   │   └── useAuth.ts               # Authentication with N8N integration
│   ├── services/
│   │   ├── transcriptionService.ts  # OpenAI Whisper integration
│   │   ├── n8nWebhooks.ts           # N8N workflow automation
│   │   └── supabase.ts              # Database and auth service
│   ├── config/
│   │   └── n8nConfig.ts             # N8N configuration
│   └── types/                       # TypeScript type definitions
├── .env                         # Environment variables (create from .env.example)
└── .env.example                # Environment template
```

## 🔧 Key Integrations

### **OpenAI Whisper (Voice Transcription)**
- **Direct API Integration**: No backend proxy needed
- **File Format**: WebM with Opus codec for optimal quality
- **Auto-triggering**: Transcription starts automatically when recording stops
- **Error Handling**: Comprehensive validation and error messages

### **N8N Workflow Automation**
- **User Signup Automation**: Triggers marketing and CRM workflows
- **Webhook Payloads**: Rich data including user metadata and analytics
- **Non-blocking**: Signup succeeds even if automation fails
- **Configurable**: Enable/disable workflows via environment variables

## 📚 Documentation

### **For Developers**
- 📋 [`CLAUDE.md`](./CLAUDE.md) - Complete project context for AI assistants
- 📅 [`docs/DEVELOPMENT_LOG.md`](./docs/DEVELOPMENT_LOG.md) - Development progress and decisions
- 🔌 [`docs/API_INTEGRATIONS.md`](./docs/API_INTEGRATIONS.md) - Detailed API integration guides

### **For Setup**
- 🚀 [`docs/SETUP_GUIDE.md`](./docs/SETUP_GUIDE.md) - Detailed setup instructions
- 📝 [`docs/PROJECT_HANDOFF.md`](./docs/PROJECT_HANDOFF.md) - Project handoff documentation

## 🐛 Known Issues

### **Non-blocking Issues**
- **Supabase TypeScript Errors**: Build warnings that don't affect functionality
- **Build Status**: Core features work perfectly despite TypeScript warnings

## 🎯 Usage

### **Voice Transcription**
1. Click the microphone button in the chat interface
2. Speak clearly (recording indicator shows red and pulsing)
3. Click again to stop recording
4. Text automatically appears in the input field
5. Edit if needed and send message

### **File Attachments**
1. Click the paperclip icon
2. Select files to attach
3. Files appear as attachments below input
4. Send message with attachments

### **Workflow Automation**
- User signups automatically trigger configured N8N workflows
- Check N8N dashboard for workflow execution status
- Debug mode available via `VITE_N8N_DEBUG=true`

## 🔧 Troubleshooting

### **Voice Transcription Issues**
1. **"OpenAI API key not configured"**: Check `.env` file has `VITE_OPENAI_API_KEY`
2. **Microphone not working**: Check browser permissions for microphone access
3. **Poor transcription quality**: Ensure clear speech and minimize background noise

### **Environment Issues**
1. **Changes not reflecting**: Restart dev server after editing `.env`
2. **Build errors**: Run `npm run build` to check for TypeScript issues
3. **Missing features**: Verify all required environment variables are set

### **N8N Workflow Issues**
1. **Webhooks not triggering**: Check webhook URLs and N8N instance status
2. **Debug webhooks**: Enable `VITE_N8N_DEBUG=true` for detailed console logs
3. **Workflow failures**: Check N8N execution logs for error details

## 📞 Support & Resources

### **API Documentation**
- [OpenAI Whisper API](https://platform.openai.com/docs/api-reference/audio)
- [N8N Webhook Documentation](https://docs.n8n.io/webhooks/)
- [Supabase Documentation](https://supabase.com/docs)

### **Development Resources**
- [Vite Documentation](https://vitejs.dev/guide/)
- [React 19 Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🏷️ Version Information

- **Current Status**: Core functionality complete ✅
- **Last Updated**: July 10, 2025
- **Phase**: Ready for feature enhancements and customizations

## 📄 License

[Add your license information here]

---

*For detailed development context and AI assistant instructions, see [`CLAUDE.md`](./CLAUDE.md)*