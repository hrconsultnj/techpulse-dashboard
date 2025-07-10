// Default app configuration (similar to Bubble.io app settings)
const appConfig = {
  name: process.env.REACT_APP_NAME || 'Dashboard Template',
  description: process.env.REACT_APP_DESCRIPTION || 'A customizable dashboard template',
  logo: {
    src: '/logo.png',
    alt: 'App Logo'
  },
  theme: {
    primaryColor: '#3B82F6', // Blue
    secondaryColor: '#10B981', // Green
    accentColor: '#F59E0B', // Amber
    backgroundColor: '#F9FAFB',
    textColor: '#1F2937'
  },
  defaultLayout: {
    showSidebar: true,
    sidebarWidth: 250,
    headerHeight: 64
  },
  // Add other global configuration options here
};

export default appConfig;