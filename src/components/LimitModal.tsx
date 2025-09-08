import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LimitModal: React.FC<LimitModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/premium');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Limite Atingido</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-yellow-600" />
              </div>
              <p className="text-gray-600 mb-4">
                Você já assistiu seus 3 vídeos gratuitos desta semana!
              </p>
              <p className="text-sm text-gray-500">
                Assine o plano Premium para ter acesso ilimitado a todas as atividades.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleUpgrade}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Assinar Premium
              </button>
              <button
                onClick={onClose}
                className="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
              >
                Voltar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
