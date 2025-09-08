import { Database } from './database.types';

export type Material = Database['public']['Tables']['materiais']['Row'];
export type Video = Database['public']['Tables']['videos']['Row'];
export type Usuario = Database['public']['Tables']['usuarios']['Row'];

export interface User extends Usuario {}

export type LoginData = Omit<User, 'tipoPlano' | 'videosAssistidosNoMes' | 'dataCadastro'>;

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInWithProvider: (provider: 'google' | 'facebook') => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => Promise<void>;
  incrementVideoWatch: () => Promise<boolean>;
  canWatchVideo: () => boolean;
}
