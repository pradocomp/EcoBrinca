import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader } from 'lucide-react';
import { useFilteredVideos, useMateriais } from '../hooks/useSupabaseData';
import { VideoCard } from '../components/VideoCard';
import { BottomNavigation } from '../components/BottomNavigation';

export const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedMaterials } = location.state as { selectedMaterials: string[] };
  const { videos: filteredVideos, loading, error } = useFilteredVideos(selectedMaterials);
  const { materiais } = useMateriais();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Buscando atividades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro: {error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Atividades Encontradas</h1>
          <p className="text-sm text-gray-600">{filteredVideos.length} resultados</p>
        </div>
      </div>

      <div className="p-4">
        {filteredVideos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-gray-600">
              Tente selecionar outros materiais ou volte para escolher novamente.
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
