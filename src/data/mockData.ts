import { Material, Video } from '../types';

export const materiais: Material[] = [
  { id: '1', nome: 'Papelão', emoji: '📦' },
  { id: '2', nome: 'Tampinha', emoji: '🧃' },
  { id: '3', nome: 'Garrafa PET', emoji: '🥤' },
  { id: '4', nome: 'Balão', emoji: '🎈' },
  { id: '5', nome: 'Papel', emoji: '✂️' },
  { id: '6', nome: 'Linha', emoji: '🧵' },
  { id: '7', nome: 'Rolo de Papel', emoji: '🧻' },
  { id: '8', nome: 'Lata', emoji: '🥫' },
  { id: '9', nome: 'CD/DVD', emoji: '💿' },
  { id: '10', nome: 'Caixa de Ovos', emoji: '🥚' }
];

export const videos: Video[] = [
  {
    id: '1',
    titulo: 'Robô de Papelão',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materiais: ['1', '2', '5'],
    idadeRecomendada: '4-8 anos',
    duracao: 15,
    descricao: 'Crie um robô incrível usando caixas de papelão e materiais simples!',
    thumbnail: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/green/white?text=Robô+de+Papelão'
  },
  {
    id: '2',
    titulo: 'Jogo da Memória com Tampinhas',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materiais: ['2', '5'],
    idadeRecomendada: '3-10 anos',
    duracao: 10,
    descricao: 'Um jogo educativo e divertido usando tampinhas coloridas!',
    thumbnail: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/blue/white?text=Jogo+da+Memória'
  },
  {
    id: '3',
    titulo: 'Vaso de Flores Ecológico',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materiais: ['3', '5'],
    idadeRecomendada: '5-12 anos',
    duracao: 20,
    descricao: 'Transforme garrafas PET em lindos vasos para suas plantas!',
    thumbnail: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/green/white?text=Vaso+Ecológico'
  },
  {
    id: '4',
    titulo: 'Foguete Espacial',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materiais: ['1', '4', '5'],
    idadeRecomendada: '6-10 anos',
    duracao: 25,
    descricao: 'Construa um foguete que realmente voa usando materiais recicláveis!',
    thumbnail: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/red/white?text=Foguete+Espacial'
  },
  {
    id: '5',
    titulo: 'Binóculos de Aventureiro',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    materiais: ['7', '6', '5'],
    idadeRecomendada: '4-9 anos',
    duracao: 12,
    descricao: 'Crie binóculos funcionais para as aventuras do seu pequeno explorador!',
    thumbnail: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/orange/white?text=Binóculos'
  }
];
