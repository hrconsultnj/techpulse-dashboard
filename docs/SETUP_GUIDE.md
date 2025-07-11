# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

If that fails, manually install the required packages:
```bash
npm install @supabase/supabase-js react-router-dom formik yup react-query styled-components react-beautiful-dnd react-icons
```

### 2. Set Up Environment Variables
```bash
cp .env.template .env
```

Edit `.env` with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_NAME=Your App Name
REACT_APP_DESCRIPTION=Your app description
```

### 3. Configure Tailwind CSS (if not working)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Start Development Server
```bash
npm run dev
```

## Project Structure Explained

### Pages
- `src/pages/Auth/` - All authentication-related pages
- `src/pages/Dashboard.js` - Main dashboard after login
- `src/pages/Settings.js` - User settings page
- `src/pages/PageBuilder.js` - Drag-and-drop page builder

### Components
- `src/components/layout/` - Header, Sidebar, Footer
- Components are designed to be reusable across pages

### Services
- `src/services/supabase.js` - All Supabase integration
- Includes auth helpers and database operations

### Hooks
- `src/hooks/useAuth.js` - Authentication state management
- `src/hooks/useDatabase.js` - Database operations with React Query

## Customization

### Branding
Edit `src/config/appConfig.js`:
```javascript
const appConfig = {
  name: 'Your App Name',
  description: 'Your app description',
  logo: {
    src: '/your-logo.png',
    alt: 'Your Logo'
  },
  theme: {
    primaryColor: '#3B82F6',
    // ... other theme options
  }
};
```

### Styling
- Global styles in `src/styles/global.css`
- Theme configuration in `src/styles/theme.js`
- Uses Tailwind CSS classes throughout

### Database Schema
You'll need these tables in Supabase:
```sql
-- Users table (handled by Supabase Auth)
-- Stats table for dashboard
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  change NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add more tables as needed
```

## Common Issues & Solutions

### Import Errors (`@/` not found)
Make sure `vite.config.ts` has the alias configuration:
```typescript
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

### CSS Classes Not Working
If custom CSS classes aren't working, check:
1. `src/styles/global.css` is imported in `App.js`
2. Tailwind is properly configured
3. Class names match what's defined in CSS

### Authentication Issues
1. Check Supabase project settings
2. Verify environment variables are correct
3. Check browser console for auth errors

## Development Workflow

1. **Start with authentication** - Get login/register working
2. **Test protected routes** - Make sure redirects work
3. **Customize dashboard** - Add your specific data/widgets
4. **Add new pages** - Follow the existing pattern
5. **Style to match your brand** - Update theme and colors

## Deployment

### Environment Variables
Set these in your hosting platform:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_NAME`
- `REACT_APP_DESCRIPTION`

### Build Process
```bash
npm run build
```

The `dist/` folder contains your built app ready for deployment.

## Getting Help

1. Check the browser console for errors
2. Review the handoff documentation in `docs/PROJECT_HANDOFF.md`
3. Check Supabase documentation for database/auth issues
4. Review React Router docs for routing issues