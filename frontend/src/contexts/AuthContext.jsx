import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          createdAt: user.metadata.creationTime,
          lastLogin: user.metadata.lastSignInTime
        });
      } else {
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      setCurrentUser(user);
      setUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime
      });
      
      return { success: true };
    } catch (error) {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      const user = userCredential.user;

      // Update user profile with name
      if (userData.firstName || userData.lastName) {
        const displayName = `${userData.firstName} ${userData.lastName}`.trim();
        await updateProfile(user, {
          displayName: displayName
        });
      }

      setCurrentUser(user);
      setUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || `${userData.firstName} ${userData.lastName}`.trim(),
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime
      });
      
      return { success: true };
    } catch (error) {
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
        default:
          message = error.message;
      }
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, profileData);
        setUserProfile(prev => ({
          ...prev,
          ...profileData
        }));
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const sendEmailVerification = async () => {
    try {
      if (currentUser) {
        // Note: This requires the user to be recently signed in
        // You might need to re-authenticate the user first
        await currentUser.sendEmailVerification();
        return { success: true, message: 'Verification email sent!' };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile: updateUserProfile,
    sendEmailVerification,
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.emailVerified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}