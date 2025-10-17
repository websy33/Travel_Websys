import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, checkAuthState, getUserDoc } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = checkAuthState(async (u) => {
      try {
        setUser(u);
        if (u) {
          try {
            const doc = await getUserDoc(u.uid);
            setProfile(doc || null);
          } catch (err) {
            // If Firestore rules block the read, avoid blocking the app
            console.warn('Failed to read user profile from Firestore:', err?.message || err);
            // Fallback minimal profile so the app can still render and show limited UI
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
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
