import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader } from 'lucide-react';
import { useSearchVideos, useMateriais } from '../hooks/useSupabaseData';
import { VideoCard } from '../components/VideoCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { useNavigate } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { videos: filteredVideos, loading } = useSearchVideos(searchQuery);
  const { materiais } = useMateriais();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Buscar Atividades</h1>
        
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Digite o nome da atividade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader size={48} className="animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Buscando atividades...</p>
          </div>
        ) : searchQuery === '' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Encontre sua próxima criação
            </h3>
            <p className="text-gray-600">
              Digite acima para buscar por atividades específicas
            </p>
          </motion.div>
        ) : filteredVideos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-600">
              Tente buscar por outros termos ou palavras-chave
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VideoCard
                  video={video}
                  materiais={materiais}
                  onClick={() => navigate(`/video/${video.id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};
