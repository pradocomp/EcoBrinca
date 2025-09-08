export interface Database {
  public: {
    Tables: {
      materiais: {
        Row: {
          id: string;
          nome: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          titulo: string;
          video_url: string;
          materiais: string[];
          idade_recomendada: string;
          duracao: number;
          descricao: string;
          thumbnail: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          video_url: string;
          materiais: string[];
          idade_recomendada: string;
          duracao: number;
          descricao: string;
          thumbnail: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          video_url?: string;
          materiais?: string[];
          idade_recomendada?: string;
          duracao?: number;
          descricao?: string;
          thumbnail?: string;
          created_at?: string;
        };
      };
      usuarios: {
        Row: {
          id: string;
          nome: string;
          email: string;
          tipo_plano: 'gratuito' | 'premium';
          videos_assistidos_no_mes: number;
          data_cadastro: string;
          auth_provider: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_subscription_status: string | null;
        };
        Insert: {
          id?: string;
          nome: string;
          email: string;
          tipo_plano?: 'gratuito' | 'premium';
          videos_assistidos_no_mes?: number;
          data_cadastro?: string;
          auth_provider: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_subscription_status?: string | null;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          tipo_plano?: 'gratuito' | 'premium';
          videos_assistidos_no_mes?: number;
          data_cadastro?: string;
          auth_provider?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_subscription_status?: string | null;
        };
      };
    };
  };
}
