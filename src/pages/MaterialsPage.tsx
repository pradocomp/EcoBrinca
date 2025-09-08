import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Loader } from 'lucide-react';
import { useMateriais } from '../hooks/useSupabaseData';
import { BottomNavigation } from '../components/BottomNavigation';

export const MaterialsPage: React.FC = () => {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const navigate = useNavigate();
  const { materiais, loading, error } = useMateriais();

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleSearch = () => {
    if (selectedMaterials.length === 0) {
      alert('Selecione pelo menos um material!');
      return;
    }
    navigate('/resultados', { state: { selectedMaterials } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando materiais...</p>
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
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">O que você tem em casa hoje?</h1>
        <p className="opacity-90">Selecione os materiais disponíveis</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {materiais.map((material) => {
            const isSelected = selectedMaterials.includes(material.id);
            
            return (
              <motion.button
                key={material.id}
                onClick={() => toggleMaterial(material.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
              >
                <img 
                  src={material.image_url} 
                  alt={material.nome} 
                  className="w-20 h-20 object-cover rounded-lg mx-auto mb-3"
                />
                <div className="text-sm font-semibold text-gray-800">
                  {material.nome}
                </div>
              </motion.button>
            );
          })}
        </div>

        {selectedMaterials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-md mb-6"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Materiais selecionados:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedMaterials.map(id => {
                const material = materiais.find(m => m.id === id);
                return (
                  <span key={id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <img src={material?.image_url} alt={material?.nome} className="w-5 h-5 rounded-full object-cover" />
                    {material?.nome}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleSearch}
          disabled={selectedMaterials.length === 0}
          className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
            selectedMaterials.length > 0
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileTap={{ scale: selectedMaterials.length > 0 ? 0.98 : 1 }}
        >
          <Search size={20} />
          <span>Buscar Atividades</span>
        </motion.button>
      </div>

      <BottomNavigation />
    </div>
  );
};
