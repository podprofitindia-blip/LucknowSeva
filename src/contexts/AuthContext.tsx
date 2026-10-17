import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAIL } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    currentUser && 
    currentUser.email && 
    currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const loggedEmail = result.user.email?.toLowerCase();
      
      if (loggedEmail !== ADMIN_EMAIL.toLowerCase()) {
        setAuthError(`लॉगिन सफल रहा (${loggedEmail}), लेकिन केवल अधिकृत एडमिन (${ADMIN_EMAIL}) ही बुकिंग्स देख सकते हैं।`);
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('लॉगिन विंडो बंद कर दी गई।');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('ब्राउज़र ने लॉगिन पॉप-अप ब्लॉक कर दिया। कृपया पॉप-अप की अनुमति दें।');
      } else {
        setAuthError(err.message || 'लॉगिन विफल रहा। कृपया पुनः प्रयास करें।');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoading,
        authError,
        loginWithGoogle,
        logout,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
