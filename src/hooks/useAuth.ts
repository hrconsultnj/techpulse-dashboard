import { useState, useEffect, useCallback } from 'react'
import { supabase, db } from '@/services/supabase'
import type { 
  User, 
  UserProfile, 
  AuthState, 
  LoginCredentials, 
  RegisterData,
  PasswordResetData,
  PasswordUpdateData
} from '@/types'

// Return type for authentication operations
interface AuthOperationResult {
  error: string | null
  data?: any
}

// Enhanced useAuth hook with full TypeScript support
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  })

  // Helper to set error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }))
  }, [])

  // Helper to set loading state
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  // Fetch user profile from database
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const profile = await db.getById('user_profiles', userId)
      return profile as UserProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }, [])

  // Sign in function
  const signIn = useCallback(async (credentials: LoginCredentials): Promise<AuthOperationResult> => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithPassword(credentials)
      if (error) throw error
      
      // Profile will be loaded by the auth state change listener
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }, [setError, setLoading])

  // Sign up function
  const signUp = useCallback(async (data: RegisterData): Promise<AuthOperationResult> => {
    try {
      setLoading(true)
      setError(null)
      
      const { email, password, ...profileData } = data
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: profileData
        }
      })
      
      if (error) throw error
      
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }, [setError, setLoading])

  // Sign out function
  const signOut = useCallback(async (): Promise<AuthOperationResult> => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear state immediately
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null
      })
      
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }, [setError, setLoading])

  // Reset password function
  const resetPassword = useCallback(async (data: PasswordResetData): Promise<AuthOperationResult> => {
    try {
      setError(null)
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) throw error
      
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }, [setError])

  // Update password function
  const updatePassword = useCallback(async (data: PasswordUpdateData): Promise<AuthOperationResult> => {
    try {
      setError(null)
      
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      const { error } = await supabase.auth.updateUser({ password: data.password })
      if (error) throw error
      
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password update failed'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }, [setError])

  // Update user profile function
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<AuthOperationResult> => {
    try {
      if (!state.user) {
        throw new Error('No user logged in')
      }
      
      setLoading(true)
      setError(null)
      
      // Update user metadata in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (authError) throw authError
      
      // Update user profile in database
      const updatedProfile = await db.update('user_profiles', state.user.id, updates)
      
      // Update state with new profile
      setState(prev => ({
        ...prev,
        profile: updatedProfile as UserProfile,
        loading: false
      }))
      
      return { error: null, data: updatedProfile }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }, [state.user, setError, setLoading])

  // Create user profile in database (called after signup)
  const createProfile = useCallback(async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      const profile = await db.create('user_profiles', {
        id: userId,
        email: profileData.email || '',
        full_name: profileData.full_name || null,
        role: profileData.role || 'customer',
        company_name: profileData.company_name || null,
        phone: profileData.phone || null
      })
      
      return profile as UserProfile
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  }, [])

  // Check if user has permission for a specific role
  const hasRole = useCallback((requiredRole: UserProfile['role']): boolean => {
    if (!state.profile) return false
    
    const roleHierarchy: Record<UserProfile['role'], number> = {
      customer: 1,
      technician: 2,
      supervisor: 3,
      admin: 4
    }
    
    const userLevel = roleHierarchy[state.profile.role]
    const requiredLevel = roleHierarchy[requiredRole]
    
    return userLevel >= requiredLevel
  }, [state.profile])

  // Check if user has permission for specific actions
  const canAccess = useCallback((resource: string): boolean => {
    if (!state.profile) return false
    
    // Define access control rules
    const permissions: Record<UserProfile['role'], string[]> = {
      customer: ['own_tickets', 'chat'],
      technician: ['own_tickets', 'assigned_tickets', 'chat', 'knowledge_base'],
      supervisor: ['all_location_tickets', 'team_management', 'analytics', 'chat', 'knowledge_base'],
      admin: ['all_tickets', 'user_management', 'system_settings', 'analytics', 'chat', 'knowledge_base']
    }
    
    return permissions[state.profile.role]?.includes(resource) || false
  }, [state.profile])

  // Effect to handle authentication state changes
  useEffect(() => {
    let mounted = true

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session?.user && mounted) {
          // Fetch user profile from database
          const profile = await fetchUserProfile(session.user.id)
          
          setState({
            user: session.user as User,
            profile,
            loading: false,
            error: null
          })
        } else if (mounted) {
          setState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        if (mounted) {
          const errorMessage = error instanceof Error ? error.message : 'Session error'
          setError(errorMessage)
        }
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        if (session?.user) {
          // User signed in
          const profile = await fetchUserProfile(session.user.id)
          
          // If profile doesn't exist, create it (new user)
          let userProfile = profile
          if (!profile && event === 'SIGNED_IN') {
            userProfile = await createProfile(session.user.id, {
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name,
              role: session.user.user_metadata?.role || 'customer',
              company_name: session.user.user_metadata?.company_name,
              phone: session.user.user_metadata?.phone
            })
          }
          
          setState({
            user: session.user as User,
            profile: userProfile,
            loading: false,
            error: null
          })
        } else {
          // User signed out
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null
          })
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchUserProfile, createProfile, setError])

  return {
    // State
    ...state,
    
    // Authentication functions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    
    // Permission helpers
    hasRole,
    canAccess,
    
    // Computed properties
    isAuthenticated: !!state.user,
    isCustomer: state.profile?.role === 'customer',
    isTechnician: state.profile?.role === 'technician',
    isSupervisor: state.profile?.role === 'supervisor',
    isAdmin: state.profile?.role === 'admin',
  }
}