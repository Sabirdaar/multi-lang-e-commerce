import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { userService } from '../services/firestoreService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to handle Google users
  const handleGoogleUser = async (user) => {
    try {
      console.log('🔄 Handling Google user:', user.uid);
      
      // Check if user profile exists in Firestore
      const profileResult = await userService.getUserProfile(user.uid);
      
      if (profileResult.success) {
        // User exists in Firestore, use that data
        console.log('✅ Existing Google user profile found');
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          createdAt: user.metadata.creationTime,
          lastLogin: user.metadata.lastSignInTime,
          firstName: profileResult.data.firstName || user.displayName?.split(' ')[0] || '',
          lastName: profileResult.data.lastName || user.displayName?.split(' ')[1] || ''
        };
      } else {
        // New Google user - create profile in Firestore
        console.log('📝 Creating new profile for Google user');
        const firstName = user.displayName?.split(' ')[0] || '';
        const lastName = user.displayName?.split(' ')[1] || '';
        
        const firestoreResult = await userService.createUserProfile(user.uid, {
          firstName: firstName,
          lastName: lastName,
          email: user.email
        });

        if (!firestoreResult.success) {
          console.warn('⚠️ Failed to create Firestore profile for Google user:', firestoreResult.error);
        }

        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          createdAt: user.metadata.creationTime,
          lastLogin: user.metadata.lastSignInTime,
          firstName: firstName,
          lastName: lastName
        };
      }
    } catch (error) {
      console.error('❌ Error handling Google user:', error);
      // Fallback to basic user data
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || ''
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('🔄 Auth state changed - User logged in:', user.uid);
        setCurrentUser(user);
        
        try {
          let userProfileData;
          
          // Check if user signed in with Google
          const isGoogleUser = user.providerData.some(
            provider => provider.providerId === 'google.com'
          );
          
          if (isGoogleUser) {
            console.log('🔐 Google user detected');
            userProfileData = await handleGoogleUser(user);
          } else {
            // Email/password user
            console.log('📧 Email/password user detected');
            const profileResult = await userService.getUserProfile(user.uid);
            
            if (profileResult.success) {
              userProfileData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                emailVerified: user.emailVerified,
                photoURL: user.photoURL,
                createdAt: user.metadata.creationTime,
                lastLogin: user.metadata.lastSignInTime,
                firstName: profileResult.data.firstName,
                lastName: profileResult.data.lastName
              };
            } else {
              userProfileData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                emailVerified: user.emailVerified,
                photoURL: user.photoURL,
                createdAt: user.metadata.creationTime,
                lastLogin: user.metadata.lastSignInTime
              };
            }
          }
          
          setUserProfile(userProfileData);
          console.log('✅ User profile set:', userProfileData);
          
        } catch (error) {
          console.error('❌ Error loading user profile:', error);
          // Fallback to basic user data
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            createdAt: user.metadata.creationTime,
            lastLogin: user.metadata.lastSignInTime
          });
        }
      } else {
        console.log('🔄 Auth state changed - No user');
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      console.log('🔄 Attempting login for:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Login successful:', user.uid);

      // Get user profile from Firestore after login
      const profileResult = await userService.getUserProfile(user.uid);
      
      if (profileResult.success) {
        setUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          createdAt: user.metadata.creationTime,
          lastLogin: user.metadata.lastSignInTime,
          firstName: profileResult.data.firstName,
          lastName: profileResult.data.lastName
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      let message = 'Login failed. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password.';
          break;
        default:
          message = error.message;
      }
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      console.log('🔄 Starting registration process...', userData);
      
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      const user = userCredential.user;
      
      console.log('✅ Firebase Auth user created:', user.uid);

      // 2. Update Firebase profile with display name
      let displayName = '';
      if (userData.firstName || userData.lastName) {
        displayName = `${userData.firstName} ${userData.lastName}`.trim();
        await updateProfile(user, {
          displayName: displayName
        });
        console.log('✅ Firebase profile updated with display name:', displayName);
      }

      // 3. Create user profile in Firestore
      console.log('📝 Creating Firestore profile...');
      const firestoreResult = await userService.createUserProfile(user.uid, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      });

      console.log('📊 Firestore creation result:', firestoreResult);

      // 4. Set user profile in context
      const userProfileData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime,
        firstName: userData.firstName,
        lastName: userData.lastName
      };

      setUserProfile(userProfileData);
      setCurrentUser(user);
      
      console.log('🎉 Registration completed successfully');
      return { 
        success: true,
        firestoreSuccess: firestoreResult.success
      };
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      let message = 'Registration failed. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your connection.';
          break;
        default:
          message = error.message || 'Registration failed. Please try again.';
      }
      
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user...');
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setError('');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError('Logout failed. Please try again.');
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      if (currentUser) {
        // Update Firebase profile
        await updateProfile(currentUser, profileData);
        
        // Update Firestore profile
        const firestoreResult = await userService.updateUserProfile(currentUser.uid, profileData);
        
        // Update local state
        setUserProfile(prev => ({
          ...prev,
          ...profileData
        }));
        
        return { 
          success: true,
          firestoreSuccess: firestoreResult.success 
        };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const refreshUserProfile = async () => {
    if (currentUser) {
      try {
        const profileResult = await userService.getUserProfile(currentUser.uid);
        if (profileResult.success) {
          setUserProfile(prev => ({
            ...prev,
            ...profileResult.data
          }));
          return { success: true };
        }
        return { success: false, error: profileResult.error };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'No user logged in' };
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    // State
    currentUser,
    userProfile,
    loading,
    error,
    
    // Auth methods
    login,
    register,
    logout,
    updateProfile: updateUserProfile,
    refreshUserProfile,
    clearError,
    
    // Helpers
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.emailVerified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}