import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, Crown, Video, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleManageSubscription = () => {
    if (user?.tipoPlano === 'premium') {
      alert('Redirecionando para gerenciar assinatura...');
    } else {
      navigate('/premium');
    }
  };

  const formatJoinDate = (dateString: string | undefined) => {
    if (!dateString) return '...';
    try {
      const date = new Date(dateString);
      const month = date.toLocaleString('pt-BR', { month: 'long' });
      const year = date.getFullYear();
      return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    } catch (e) {
      return 'Data inválida';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Usuário não encontrado</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            Fazer login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-green-600">
              {user.nome.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-xl font-bold">{user.nome}</h1>
          <p className="opacity-90 text-sm">{user.email}</p>
        </motion.div>
      </div>

      <div className="p-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Status do Plano</h2>
            {user.tipoPlano === 'premium' && (
              <Crown size={20} className="text-yellow-500" />
            )}
          </div>
          
          <div className="mb-4">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              user.tipoPlano === 'premium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {user.tipoPlano === 'premium' ? 'Premium' : 'Gratuito'}
            </div>
          </div>

          {user.tipoPlano === 'gratuito' && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Vídeos assistidos esta semana</span>
                <span className="font-medium">{user.videosAssistidosNoMes}/3</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(user.videosAssistidosNoMes / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleManageSubscription}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              user.tipoPlano === 'premium'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {user.tipoPlano === 'premium' ? 'Gerenciar Assinatura' : 'Assinar Premium'}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Estatísticas</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Video size={20} className="text-blue-500" />
                <span className="text-gray-700">Vídeos assistidos</span>
              </div>
              <span className="font-medium text-gray-800">{user.videosAssistidosNoMes}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-green-500" />
                <span className="text-gray-700">Membro desde</span>
              </div>
              <span className="font-medium text-gray-800">{formatJoinDate(user.dataCadastro)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <button className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors">
            <Settings size={20} className="text-gray-500" />
            <span className="text-gray-700">Configurações</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center space-x-3 hover:bg-red-50 transition-colors text-red-600"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};
