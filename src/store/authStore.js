import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  error: null,

  // Initialize auth state listener
  initializeAuth: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await get().fetchUserProfile(user.uid);
        set({ user, userProfile: profile, isLoading: false });
      } else {
        set({ user: null, userProfile: null, isLoading: false });
      }
    });
  },

  // Sign up with email and password
  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, isLoading: false });
      return userCredential.user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await get().fetchUserProfile(userCredential.user.uid);
      set({ user: userCredential.user, userProfile: profile, isLoading: false });
      return userCredential.user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Sign out
  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null, userProfile: null, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Fetch user profile from Firestore
  fetchUserProfile: async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // Save user profile to Firestore
  saveUserProfile: async (uid, profileData) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, {
        ...profileData,
        updatedAt: new Date().toISOString(),
        createdAt: profileData.createdAt || new Date().toISOString(),
      }, { merge: true });
      set({ userProfile: profileData, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
