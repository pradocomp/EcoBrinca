import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Users } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithProvider, guestLogin } = useAuth();

  const handleLogin = async (provider: 'google' | 'facebook') => {
    await signInWithProvider(provider);
  };

  const handleGuestLogin = async () => {
    await guestLogin();
    navigate('/materiais');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <motion.img
          src="https://res.cloudinary.com/djp21wtxm/image/upload/v1757335969/i4z4lq6k1y2s8x5c1n3d.png"
          alt="Eco-Bot, o mascote do EcoBrinca"
          className="w-32 h-32 mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        />
        
        <h1 className="text-4xl font-bold text-white mb-2">EcoBrinca</h1>
        <p className="text-white text-lg opacity-90 max-w-sm mx-auto leading-relaxed">
          Transforme materiais recicláveis em diversão sustentável
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-sm space-y-4"
      >
        <button
          onClick={() => handleLogin('google')}
          className="w-full bg-white text-gray-800 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          <span>Entrar com Google</span>
        </button>

        <button
          onClick={() => handleLogin('facebook')}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
          <span>Entrar com Facebook</span>
        </button>

        <button
          onClick={handleGuestLogin}
          className="w-full border-2 border-white text-white py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-all flex items-center justify-center space-x-3"
        >
          <Users size={20} />
          <span>Entrar como Convidado</span>
        </button>

        <p className="text-white text-sm text-center opacity-75 mt-4">
          Acesso limitado: 3 vídeos por semana
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-8 flex items-center space-x-2 text-white"
      >
        <Heart size={16} className="text-red-300" />
        <span className="text-sm">Educação sustentável para toda família</span>
      </motion.div>
    </div>
  );
};
