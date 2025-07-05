import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { firebaseService, MoodEntry, UserProfile } from '../services/firebaseService';

interface AppState {
  user: {
    uid: string;
    username: string;
    email: string;
    isAuthenticated: boolean;
  };
  currentMood: string;
  moodHistory: MoodEntry[];
  authError: string;
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setMood: (mood: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  clearAuthError: () => void;
  refreshMoodHistory: () => Promise<void>;
}

const initialState: AppState = {
  user: {
    uid: '',
    username: '',
    email: '',
    isAuthenticated: false,
  },
  currentMood: '',
  moodHistory: [],
  authError: '',
  isLoading: true,
};

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SIGN_UP_SUCCESS'; payload: { uid: string; username: string; email: string } }
  | { type: 'LOGIN_SUCCESS'; payload: { uid: string; username: string; email: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_MOOD'; payload: string }
  | { type: 'SET_MOOD_HISTORY'; payload: MoodEntry[] }
  | { type: 'ADD_MOOD_ENTRY'; payload: MoodEntry }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CLEAR_AUTH_ERROR' };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SIGN_UP_SUCCESS':
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: {
          ...action.payload,
          isAuthenticated: true,
        },
        authError: '',
        isLoading: false,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        authError: action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: {
          uid: '',
          username: '',
          email: '',
          isAuthenticated: false,
        },
        currentMood: '',
        moodHistory: [],
        authError: '',
        isLoading: false,
      };
    case 'SET_MOOD':
      return {
        ...state,
        currentMood: action.payload,
      };
    case 'SET_MOOD_HISTORY':
      return {
        ...state,
        moodHistory: action.payload,
      };
    case 'ADD_MOOD_ENTRY':
      return {
        ...state,
        moodHistory: [action.payload, ...state.moodHistory],
      };
    case 'CLEAR_HISTORY':
      return {
        ...state,
        moodHistory: [],
      };
    case 'CLEAR_AUTH_ERROR':
      return {
        ...state,
        authError: '',
      };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const userProfile = await firebaseService.getUserProfile(firebaseUser.uid);
          
          if (userProfile) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                uid: userProfile.uid,
                username: userProfile.username,
                email: userProfile.email,
              },
            });

            // Load mood history
            const moodHistory = await firebaseService.getMoodHistory(firebaseUser.uid);
            dispatch({ type: 'SET_MOOD_HISTORY', payload: moodHistory });
          } else {
            // User profile not found, sign out
            await firebaseService.signOut();
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        // User is signed out
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await firebaseService.signUp(username, email, password);
      
      if (result.success && result.user) {
        dispatch({
          type: 'SIGN_UP_SUCCESS',
          payload: {
            uid: result.user.uid,
            username: result.user.username,
            email: result.user.email,
          },
        });
        return true;
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: result.error || 'Sign up failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Sign up failed. Please try again.' });
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const result = await firebaseService.signIn(email, password);
      
      if (result.success && result.user) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            uid: result.user.uid,
            username: result.user.username,
            email: result.user.email,
          },
        });

        // Load mood history
        const moodHistory = await firebaseService.getMoodHistory(result.user.uid);
        dispatch({ type: 'SET_MOOD_HISTORY', payload: moodHistory });
        
        return true;
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: result.error || 'Login failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Login failed. Please try again.' });
      return false;
    }
  };

  const logout = async () => {
    try {
      await firebaseService.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if Firebase signOut fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  const setMood = async (mood: string) => {
    try {
      dispatch({ type: 'SET_MOOD', payload: mood });
      
      if (state.user.isAuthenticated) {
        const result = await firebaseService.addMoodEntry(state.user.uid, mood);
        
        if (result.success && result.entry) {
          dispatch({ type: 'ADD_MOOD_ENTRY', payload: result.entry });
        } else {
          console.error('Failed to save mood entry:', result.error);
        }
      }
    } catch (error) {
      console.error('Error setting mood:', error);
    }
  };

  const clearHistory = async () => {
    try {
      if (state.user.isAuthenticated) {
        const result = await firebaseService.clearMoodHistory(state.user.uid);
        
        if (result.success) {
          dispatch({ type: 'CLEAR_HISTORY' });
        } else {
          console.error('Failed to clear mood history:', result.error);
        }
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const refreshMoodHistory = async () => {
    try {
      if (state.user.isAuthenticated) {
        const moodHistory = await firebaseService.getMoodHistory(state.user.uid);
        dispatch({ type: 'SET_MOOD_HISTORY', payload: moodHistory });
      }
    } catch (error) {
      console.error('Error refreshing mood history:', error);
    }
  };

  const clearAuthError = () => {
    dispatch({ type: 'CLEAR_AUTH_ERROR' });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      signUp, 
      login, 
      logout, 
      setMood, 
      clearHistory, 
      clearAuthError,
      refreshMoodHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};