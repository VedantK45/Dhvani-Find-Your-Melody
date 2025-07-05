import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface MoodEntry {
  id?: string;
  date: string;
  time: string;
  mood: string;
  emoji: string;
  timestamp: Timestamp;
  userId: string;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  createdAt: Timestamp;
  lastLogin?: Timestamp;
}

class FirebaseService {
  /**
   * Sign up a new user with email and password
   */
  async signUp(username: string, email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      // Check if username is already taken
      const usernameExists = await this.checkUsernameExists(username);
      if (usernameExists) {
        return { success: false, error: 'Username already exists. Please choose a different username.' };
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update the user's display name
      await updateProfile(firebaseUser, {
        displayName: username
      });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        createdAt: Timestamp.now()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

      return { success: true, user: userProfile };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'Email already registered. Please use a different email or try logging in.' };
      } else if (error.code === 'auth/weak-password') {
        return { success: false, error: 'Password is too weak. Please use at least 6 characters.' };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Invalid email address. Please enter a valid email.' };
      }
      
      return { success: false, error: 'Sign up failed. Please try again.' };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        return { success: false, error: 'User profile not found. Please contact support.' };
      }

      const userProfile = userDoc.data() as UserProfile;

      // Update last login
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLogin: Timestamp.now()
      });

      return { success: true, user: userProfile };
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return { success: false, error: 'Invalid email or password. Please try again.' };
      } else if (error.code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many failed attempts. Please try again later.' };
      }
      
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Check if username already exists
   */
  private async checkUsernameExists(username: string): Promise<boolean> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.trim()));
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  }

  /**
   * Get user profile by UID
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Add a new mood entry
   */
  async addMoodEntry(userId: string, mood: string): Promise<{ success: boolean; entry?: MoodEntry; error?: string }> {
    try {
      const now = new Date();
      const moodEntry: Omit<MoodEntry, 'id'> = {
        date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        mood: mood,
        emoji: this.getMoodEmoji(mood),
        timestamp: Timestamp.now(),
        userId: userId
      };

      // Save to user's subcollection for better organization and no index requirements
      const userMoodEntriesRef = collection(db, 'users', userId, 'moodEntries');
      const docRef = await addDoc(userMoodEntriesRef, moodEntry);
      
      return { 
        success: true, 
        entry: { ...moodEntry, id: docRef.id } 
      };
    } catch (error) {
      console.error('Error adding mood entry:', error);
      
      // Fallback: try to save to global collection
      try {
        const globalMoodEntriesRef = collection(db, 'moodEntries');
        const fallbackDocRef = await addDoc(globalMoodEntriesRef, {
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          mood: mood,
          emoji: this.getMoodEmoji(mood),
          timestamp: Timestamp.now(),
          userId: userId
        });
        
        return { 
          success: true, 
          entry: { 
            id: fallbackDocRef.id,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            mood: mood,
            emoji: this.getMoodEmoji(mood),
            timestamp: Timestamp.now(),
            userId: userId
          } 
        };
      } catch (fallbackError) {
        console.error('Fallback save also failed:', fallbackError);
        return { success: false, error: 'Failed to save mood entry. Please try again.' };
      }
    }
  }

  /**
   * Get mood history for a user
   */
  async getMoodHistory(userId: string): Promise<MoodEntry[]> {
    try {
      // Primary approach: Use user's subcollection (no index required)
      const moodEntriesRef = collection(db, 'users', userId, 'moodEntries');
      const q = query(moodEntriesRef, orderBy('timestamp', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const moodEntries: MoodEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        moodEntries.push({
          id: doc.id,
          ...doc.data()
        } as MoodEntry);
      });
      
      return moodEntries;
    } catch (error) {
      console.error('Error getting mood history from user subcollection:', error);
      
      // Fallback: try to get mood entries from the global collection
      try {
        const globalMoodEntriesRef = collection(db, 'moodEntries');
        const fallbackQuery = query(
          globalMoodEntriesRef, 
          where('userId', '==', userId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const fallbackEntries: MoodEntry[] = [];
        
        fallbackSnapshot.forEach((doc) => {
          fallbackEntries.push({
            id: doc.id,
            ...doc.data()
          } as MoodEntry);
        });
        
        // Sort manually since we can't use orderBy without the index
        fallbackEntries.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        
        return fallbackEntries;
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        return [];
      }
    }
  }

  /**
   * Clear all mood history for a user
   */
  async clearMoodHistory(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Try to clear from user's subcollection first
      try {
        const userMoodEntriesRef = collection(db, 'users', userId, 'moodEntries');
        const userQuerySnapshot = await getDocs(userMoodEntriesRef);
        
        const userDeletePromises = userQuerySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(userDeletePromises);
      } catch (error) {
        console.log('No user subcollection found, trying global collection');
      }

      // Also clear from global collection (for any legacy entries)
      try {
        const moodEntriesRef = collection(db, 'moodEntries');
        const q = query(moodEntriesRef, where('userId', '==', userId));
        
        const querySnapshot = await getDocs(q);
        
        // Delete all mood entries for this user
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      } catch (globalError) {
        console.log('No global entries found or error clearing global entries');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing mood history:', error);
      return { success: false, error: 'Failed to clear mood history. Please try again.' };
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Get mood emoji
   */
  private getMoodEmoji(mood: string): string {
    const emojiMap: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      energetic: '⚡',
      relaxed: '😌',
      angry: '😠',
      surprised: '😲',
      neutral: '😐',
    };
    return emojiMap[mood.toLowerCase()] || '😐';
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();
export default FirebaseService;