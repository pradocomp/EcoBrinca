import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';
import { Provider } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await handleAuthUser(session.user);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await handleAuthUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthUser = async (authUser: any) => {
    // 1. Check for existing profile in our public table
    const { data: profile } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profile) {
      // 2a. If profile exists, set user state
      setUser({
        id: profile.id,
        nome: profile.nome,
        email: profile.email,
        tipoPlano: profile.tipo_plano,
        videosAssistidosNoMes: profile.videos_assistidos_no_mes,
        authProvider: profile.auth_provider,
        dataCadastro: profile.data_cadastro,
      });
    } else {
      // 2b. If not, create a new profile
      const { data: newProfile, error: createError } = await supabase
        .from('usuarios')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          nome: authUser.user_metadata?.full_name || authUser.email!,
          auth_provider: authUser.app_metadata?.provider || 'email',
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user profile:', createError);
      } else if (newProfile) {
        setUser({
          id: newProfile.id,
          nome: newProfile.nome,
          email: newProfile.email,
          tipoPlano: newProfile.tipo_plano,
          videosAssistidosNoMes: newProfile.videos_assistidos_no_mes,
          authProvider: newProfile.auth_provider,
          dataCadastro: newProfile.data_cadastro,
        });
      }
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const guestLogin = async () => {
    const guestId = `guest-user-${Date.now()}`;
    const { data: newProfile, error } = await supabase
      .from('usuarios')
      .insert({
        id: guestId,
        nome: 'Visitante',
        email: `${guestId}@ecobrinca.com`,
        auth_provider: 'guest',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating guest user:', error);
    } else if (newProfile) {
      setUser({
        id: newProfile.id,
        nome: newProfile.nome,
        email: newProfile.email,
        tipoPlano: newProfile.tipo_plano,
        videosAssistidosNoMes: newProfile.videos_assistidos_no_mes,
        authProvider: newProfile.auth_provider,
        dataCadastro: newProfile.data_cadastro,
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const incrementVideoWatch = async (): Promise<boolean> => {
    if (!user) return false;
    if (user.tipoPlano === 'premium' || user.videosAssistidosNoMes >= 3) {
      return user.tipoPlano === 'premium';
    }
    
    const newCount = user.videosAssistidosNoMes + 1;
    const { data: updatedUser, error } = await supabase
      .from('usuarios')
      .update({ videos_assistidos_no_mes: newCount })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating watch count:', error);
      return false;
    }
    
    if (updatedUser) {
      setUser(prev => prev ? { ...prev, videosAssistidosNoMes: newCount } : null);
      return true;
    }
    return false;
  };

  const canWatchVideo = (): boolean => {
    if (!user) return false;
    return user.tipoPlano === 'premium' || user.videosAssistidosNoMes < 3;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    signInWithProvider,
    guestLogin,
    logout,
    incrementVideoWatch,
    canWatchVideo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
