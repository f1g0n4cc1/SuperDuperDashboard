import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { type Session, type User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  timedOut: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const isResolved = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Set a safety timeout for initial load
    const timer = setTimeout(() => {
      if (isMounted && !isResolved.current) {
        setTimedOut(true);
      }
    }, 10000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      isResolved.current = true;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      clearTimeout(timer);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      isResolved.current = true;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      setTimedOut(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, timedOut, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
