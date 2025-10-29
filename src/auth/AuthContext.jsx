import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, checkAuthState, getUserDoc } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase auth is available
    if (!auth) {
      console.warn('Firebase not initialized, skipping auth check');
      setLoading(false);
      return;
    }

    const unsub = checkAuthState(async (u) => {
      setUser(u);
      if (u) {
        const doc = await getUserDoc(u.uid);
        setProfile(doc);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
