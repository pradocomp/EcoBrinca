import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { Video, Material } from '../types';

interface VideoCardProps {
  video: Video;
  materiais: Material[];
  onClick: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, materiais, onClick }) => {
  const getMaterialImages = () => {
    return video.materiais
      .map(materialId => materiais.find(m => m.id === materialId)?.image_url)
      .filter(Boolean)
      .slice(0, 4)
      .map((url, index) => (
        <img 
          key={index} 
          src={url} 
          alt="material" 
          className="w-6 h-6 rounded-full object-cover border-2 border-white -ml-2 first:ml-0"
        />
      ));
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.titulo}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Play size={48} className="text-white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
          <Clock size={12} className="mr-1" />
          {video.duracao}min
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{video.titulo}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {video.idade_recomendada}
          </span>
          <div className="flex items-center">{getMaterialImages()}</div>
        </div>
      </div>
    </motion.div>
  );
};
