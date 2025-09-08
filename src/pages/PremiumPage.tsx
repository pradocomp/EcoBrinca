import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, Crown, Infinity, Loader } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
import { BottomNavigation } from '../components/BottomNavigation';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PremiumPage: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<'mensal' | 'anual' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const benefits = [
    'Acesso ilimitado a todos os vídeos',
    'Filtros avançados de busca',
    'Atividades novas todo mês',
    'Sem anúncios',
    'Suporte prioritário',
    'Downloads para assistir offline'
  ];

  const handleSubscribe = async (plan: 'mensal' | 'anual') => {
    setLoadingPlan(plan);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Você precisa estar logado para assinar.');

      const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
        body: { plan },
      });

      if (functionError) throw functionError;
      if (data.error) throw new Error(data.error);

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe.js não foi carregado.');

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (stripeError) throw stripeError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 pb-20">
      <div className="p-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Crown size={40} className="text-yellow-500" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Desbloqueie diversão ilimitada</h1>
        <p className="opacity-90 mb-8">
          Acesse todo o conteúdo e desperte a criatividade da sua família
        </p>
      </div>

      <div className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-xl"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Infinity size={24} className="text-green-600" />
              <span className="text-lg font-bold text-gray-800">Benefícios Premium</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-green-600" />
                </div>
                <span className="text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <motion.button
              onClick={() => handleSubscribe('anual')}
              disabled={!!loadingPlan}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-bold relative overflow-hidden flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loadingPlan === 'anual' ? (
                <Loader size={24} className="animate-spin" />
              ) : (
                <>
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    MELHOR OFERTA
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold">Plano Anual</div>
                    <div className="text-sm opacity-90">R$ 149,90/ano</div>
                    <div className="text-xs opacity-75">2 meses grátis • R$ 12,49/mês</div>
                  </div>
                </>
              )}
            </motion.button>

            <motion.button
              onClick={() => handleSubscribe('mensal')}
              disabled={!!loadingPlan}
              className="w-full border-2 border-green-600 text-green-600 p-4 rounded-xl font-bold flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loadingPlan === 'mensal' ? (
                <Loader size={24} className="animate-spin" />
              ) : (
                <div className="text-left">
                  <div className="text-lg font-bold">Plano Mensal</div>
                  <div className="text-sm">R$ 14,90/mês</div>
                </div>
              )}
            </motion.button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Cancele a qualquer momento. Sem taxas ocultas.
          </p>
        </motion.div>

        <div className="text-center text-white text-sm opacity-75">
          <p>🔒 Pagamento seguro com criptografia SSL</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};
