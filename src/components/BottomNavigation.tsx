import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Star, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Início', path: '/materiais' },
    { icon: Search, label: 'Buscar', path: '/buscar' },
    { icon: Star, label: 'Premium', path: '/premium' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-green-600' 
                  : 'text-gray-400 hover:text-green-500'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
