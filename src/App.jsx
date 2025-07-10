import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import services
import { supabase } from './services/supabase';

// Import layouts
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Import pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import ForgotPassword from './pages/Auth/ForgotPassword';
import SplashScreen from './pages/Auth/SplashScreen';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import NotFound from './pages/Error/NotFound';

// Create a client for React Query
const queryClient = new QueryClient();

// PrivateRoute component for protected routes
const PrivateRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session from Supabase
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      // Clean up subscription
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// PublicRoute component for routes that should redirect if logged in
const PublicRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session from Supabase
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout wrapper for authenticated pages
const WithLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes - accessible without login */}
          <Route path="/" element={
            <PublicRoute>
              <SplashScreen />
            </PublicRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <WithLayout>
                <Dashboard />
              </WithLayout>
            </PrivateRoute>
          } />
          
          <Route path="/settings" element={
            <PrivateRoute>
              <WithLayout>
                <Settings />
              </WithLayout>
            </PrivateRoute>
          } />

          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;