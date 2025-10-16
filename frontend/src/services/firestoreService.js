import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export const userService = {
  // Create user profile in Firestore
  createUserProfile: async (userId, userData) => {
    try {
      console.log('🔄 Creating user profile in Firestore for:', userId);
      
      const userRef = doc(db, 'users', userId);
      const userDataToSave = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, userDataToSave);
      
      console.log('✅ User profile created successfully in Firestore');
      return { 
        success: true, 
        message: 'Profile created successfully',
        data: userDataToSave
      };
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      return { 
        success: false, 
        error: error.message,
        code: error.code 
      };
    }
  },

  // Get user profile from Firestore
  getUserProfile: async (userId) => {
    try {
      console.log('📥 Fetching user profile for:', userId);
      
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('✅ User profile found in Firestore:', userData);
        return { 
          success: true, 
          data: userData 
        };
      } else {
        console.log('❌ User profile not found in Firestore');
        return { 
          success: false, 
          error: 'User profile not found' 
        };
      }
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { 
        success: true, 
        message: 'Profile updated successfully' 
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  }
};