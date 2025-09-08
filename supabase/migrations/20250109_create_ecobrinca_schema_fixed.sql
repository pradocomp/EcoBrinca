/*
# Criação do Schema EcoBrinca - Versão Corrigida
Esta migração cria todas as tabelas necessárias para o aplicativo EcoBrinca com tipos de dados corretos.

## Query Description: 
Esta operação criará a estrutura completa do banco de dados para o EcoBrinca.
Criará 3 tabelas principais (materiais, videos, usuarios) com relacionamentos adequados.
É uma operação segura que não afeta dados existentes.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tabela materiais: id (TEXT), nome, emoji, timestamps
- Tabela videos: id (TEXT), detalhes do vídeo, array de materiais
- Tabela usuarios: id (TEXT), dados do usuário, controle de plano

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Políticas baseadas em auth.uid()

## Performance Impact:
- Indexes: Adicionados para performance
- Triggers: Nenhum
- Estimated Impact: Mínimo impacto, apenas criação de estrutura
*/

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de materiais
CREATE TABLE IF NOT EXISTS public.materiais (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    nome TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de vídeos
CREATE TABLE IF NOT EXISTS public.videos (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    titulo TEXT NOT NULL,
    video_url TEXT NOT NULL,
    materiais TEXT[] DEFAULT '{}',
    idade_recomendada TEXT NOT NULL,
    duracao INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS public.usuarios (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    tipo_plano TEXT DEFAULT 'gratuito' CHECK (tipo_plano IN ('gratuito', 'premium')),
    videos_assistidos_no_mes INTEGER DEFAULT 0,
    data_cadastro TIMESTAMPTZ DEFAULT NOW(),
    auth_provider TEXT NOT NULL
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para materiais (leitura pública)
CREATE POLICY "Materiais são visíveis publicamente" ON public.materiais
    FOR SELECT USING (true);

-- Políticas de segurança para vídeos (leitura pública)
CREATE POLICY "Vídeos são visíveis publicamente" ON public.videos
    FOR SELECT USING (true);

-- Políticas de segurança para usuários (acesso próprio apenas)
CREATE POLICY "Usuários podem ver seus próprios dados" ON public.usuarios
    FOR SELECT USING (auth.uid()::TEXT = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados" ON public.usuarios
    FOR UPDATE USING (auth.uid()::TEXT = id);

CREATE POLICY "Usuários podem inserir seus próprios dados" ON public.usuarios
    FOR INSERT WITH CHECK (auth.uid()::TEXT = id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_materiais_nome ON public.materiais(nome);
CREATE INDEX IF NOT EXISTS idx_videos_titulo ON public.videos(titulo);
CREATE INDEX IF NOT EXISTS idx_videos_materiais ON public.videos USING GIN(materiais);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo_plano ON public.usuarios(tipo_plano);

-- Inserir dados de exemplo para materiais
INSERT INTO public.materiais (id, nome, emoji) VALUES
    ('1', 'Papelão', '📦'),
    ('2', 'Tampinha', '🧃'),
    ('3', 'Garrafa PET', '🥤'),
    ('4', 'Balão', '🎈'),
    ('5', 'Papel', '✂️'),
    ('6', 'Linha', '🧵'),
    ('7', 'Rolo de Papel', '🧻'),
    ('8', 'Lata', '🥫'),
    ('9', 'CD/DVD', '💿'),
    ('10', 'Caixa de Ovos', '🥚')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados de exemplo para vídeos
INSERT INTO public.videos (id, titulo, video_url, materiais, idade_recomendada, duracao, descricao, thumbnail) VALUES
    ('1', 'Robô de Papelão', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['1', '2', '5'], '4-8 anos', 15, 'Crie um robô incrível usando caixas de papelão e materiais simples!', 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/green/white?text=Rob%C3%B4+de+Papel%C3%A3o'),
    ('2', 'Jogo da Memória com Tampinhas', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['2', '5'], '3-10 anos', 10, 'Um jogo educativo e divertido usando tampinhas coloridas!', 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/blue/white?text=Jogo+da+Mem%C3%B3ria'),
    ('3', 'Vaso de Flores Ecológico', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['3', '5'], '5-12 anos', 20, 'Transforme garrafas PET em lindos vasos para suas plantas!', 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/green/white?text=Vaso+Ecol%C3%B3gico'),
    ('4', 'Foguete Espacial', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['1', '4', '5'], '6-10 anos', 25, 'Construa um foguete que realmente voa usando materiais recicláveis!', 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/red/white?text=Foguete+Espacial'),
    ('5', 'Binóculos de Aventureiro', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['7', '6', '5'], '4-9 anos', 12, 'Crie binóculos funcionais para as aventuras do seu pequeno explorador!', 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/orange/white?text=Bin%C3%B3culos'),
    ('6', 'Jogo de Boliche com Latas', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['8', '4'], '5-10 anos', 8, 'Diversão garantida com este jogo de boliche feito com latas recicladas!', 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/purple/white?text=Boliche'),
    ('7', 'Mobile Musical com CDs', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['9', '6'], '3-8 anos', 18, 'Crie um lindo mobile que brilha e faz sons suaves para decorar o quarto!', 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/yellow/black?text=Mobile+Musical'),
    ('8', 'Jardim de Temperos', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['10', '5'], '6-12 anos', 22, 'Use caixas de ovos para criar um mini jardim de temperos!', 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/green/white?text=Jardim+Temperos')
ON CONFLICT (id) DO NOTHING;
