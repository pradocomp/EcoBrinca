import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Maximize, Clock } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnail: string;
  duration: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  title, 
  thumbnail, 
  duration 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration * 60) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / (duration * 60)) * 100;

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {/* Video Thumbnail/Background */}
      <img
        src={thumbnail}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-30' : 'opacity-100'
        }`}
      />

      {/* Play Animation Overlay */}
      {isPlaying && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-lg font-semibold">Reproduzindo...</p>
              <p className="text-sm opacity-75">{title}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Video Controls */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-white bg-opacity-30 rounded-full h-1">
            <motion.div
              className="bg-red-500 h-1 rounded-full"
              style={{ width: `${progressPercentage}%` }}
              animate={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-white text-xs mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration * 60)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={togglePlay}
              className="text-white hover:text-red-400 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </motion.button>
            
            <button className="text-white hover:text-red-400 transition-colors">
              <Volume2 size={24} />
            </button>
            
            <div className="text-white text-sm">
              <Clock size={16} className="inline mr-1" />
              {duration} min
            </div>
          </div>

          <button className="text-white hover:text-red-400 transition-colors">
            <Maximize size={24} />
          </button>
        </div>
      </motion.div>

      {/* Play Button Overlay (when not playing) */}
      {!isPlaying && (
        <motion.button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-red-600 text-white p-4 rounded-full shadow-lg">
            <Play size={32} className="ml-1" />
          </div>
        </motion.button>
      )}
    </div>
  );
};
