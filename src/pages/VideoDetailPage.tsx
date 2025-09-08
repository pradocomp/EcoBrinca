import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Loader, Star } from 'lucide-react';
import { useVideos, useMateriais } from '../hooks/useSupabaseData';
import { useAuth } from '../context/AuthContext';
import { LimitModal } from '../components/LimitModal';
import { VideoPlayer } from '../components/VideoPlayer';

export const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, incrementVideoWatch, canWatchVideo } = useAuth();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  
  const { videos, loading: videosLoading } = useVideos();
  const { materiais, loading: materiaisLoading } = useMateriais();
  
  const video = videos.find(v => v.id === id);
  const loading = videosLoading || materiaisLoading;

  const handleStartWatching = async () => {
    if (!canWatchVideo()) {
      setShowLimitModal(true);
      return;
    }

    const success = await incrementVideoWatch();
    if (success) {
      setIsWatching(true);
    } else {
      setShowLimitModal(true);
    }
  };

  const getVideoMaterials = () => {
    if (!video || !materiais.length) return [];
    return video.materiais
      .map(materialId => materiais.find(m => m.id === materialId))
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando vídeo...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Vídeo não encontrado</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800 truncate">
            {video.titulo}
          </h1>
          {user?.tipoPlano === 'premium' && (
            <div className="flex items-center text-yellow-600 text-sm">
              <Star size={14} className="mr-1" />
              <span>Premium</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Video Player */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {isWatching ? (
            <VideoPlayer
              videoUrl={video.video_url}
              title={video.titulo}
              thumbnail={video.thumbnail}
              duration={video.duracao}
            />
          ) : (
            <div className="aspect-video relative">
              <img
                src={video.thumbnail}
                alt={video.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <motion.button
                  onClick={handleStartWatching}
                  className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold flex items-center space-x-2 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-4 border-l-green-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                  </div>
                  <span>Começar Agora</span>
                </motion.button>
              </div>
              
              {/* Free User Overlay */}
              {user?.tipoPlano === 'gratuito' && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {user.videosAssistidosNoMes}/3 grátis
                </div>
              )}
            </div>
          )}
        </div>

        {/* Video Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{video.titulo}</h2>
          
          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{video.duracao} minutos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{video.idade_recomendada}</span>
            </div>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{video.descricao}</p>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Materiais necessários:</h3>
            <div className="grid grid-cols-2 gap-3">
              {getVideoMaterials().map((material) => (
                <div
                  key={material?.id}
                  className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3"
                >
                  <img src={material?.image_url} alt={material?.nome} className="w-10 h-10 object-cover rounded-md" />
                  <span className="text-sm font-medium text-gray-700">
                    {material?.nome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Como fazer:</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <p className="text-gray-700">Separe todos os materiais necessários em um local limpo e organizado.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <p className="text-gray-700">Assista ao vídeo completo para entender todas as etapas.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <p className="text-gray-700">Siga o passo a passo com calma, pausando quando necessário.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <p className="text-gray-700">Divirta-se com sua criação sustentável!</p>
            </div>
          </div>
        </div>
      </div>

      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
};
