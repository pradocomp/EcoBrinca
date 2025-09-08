import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Material = Database['public']['Tables']['materiais']['Row'];
type Video = Database['public']['Tables']['videos']['Row'];
type Usuario = Database['public']['Tables']['usuarios']['Row'];

export const useMateriais = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const { data, error } = await supabase
          .from('materiais')
          .select('*')
          .order('nome');

        if (error) throw error;
        setMateriais(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar materiais');
      } finally {
        setLoading(false);
      }
    };

    fetchMateriais();
  }, []);

  return { materiais, loading, error };
};

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar vídeos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};

export const useFilteredVideos = (selectedMaterials: string[]) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedMaterials.length === 0) {
      setVideos([]);
      setLoading(false);
      return;
    }

    const fetchFilteredVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .overlaps('materiais', selectedMaterials)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar vídeos');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredVideos();
  }, [selectedMaterials]);

  return { videos, loading, error };
};

export const useSearchVideos = (searchQuery: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setVideos([]);
      return;
    }

    const searchVideos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar vídeos');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchVideos, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return { videos, loading, error };
};

export const useUsuario = (userId: string | null) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateUsuario = async (updates: Partial<Usuario>) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      setUsuario(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
      return null;
    }
  };

  const createUsuario = async (userData: Database['public']['Tables']['usuarios']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;
      setUsuario(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
      return null;
    }
  };

  useEffect(() => {
    if (!userId) {
      setUsuario(null);
      setLoading(false);
      return;
    }

    const fetchUsuario = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Usuário não encontrado
            setUsuario(null);
          } else {
            throw error;
          }
        } else {
          setUsuario(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [userId]);

  return { usuario, loading, error, updateUsuario, createUsuario };
};
