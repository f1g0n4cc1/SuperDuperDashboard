import React from 'react';
import { supabase } from '../services/supabase';

export const Login: React.FC = () => {
  const handleGoogleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-batcave-bg px-6">
      <div className="glass-panel w-full max-w-md p-10 text-center rounded-3xl">
        <h1 className="mb-2 text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          VAULT 101
        </h1>
        <p className="mb-8 text-batcave-text-secondary text-sm font-medium">Enter the workspace.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="group relative w-full overflow-hidden rounded-2xl bg-white py-4 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-95"
        >
          <span className="relative z-10">Sign in with Google</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-batcave-blue to-blue-400 transition-transform duration-500 group-hover:translate-x-0" />
        </button>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[10px] text-batcave-text-secondary uppercase tracking-[0.2em]">
            Secure Access Portal v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
