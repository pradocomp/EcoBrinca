/*
# Criação do Schema EcoBrinca
Criação das tabelas principais do aplicativo EcoBrinca para gerenciar materiais, vídeos e usuários.

## Query Description: 
Esta operação criará a estrutura inicial do banco de dados do EcoBrinca. Inclui tabelas para materiais recicláveis, vídeos educativos e gerenciamento de usuários com sistema freemium. As tabelas incluem políticas RLS para segurança dos dados dos usuários.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tabela materiais: ID, nome, emoji, data_criacao
- Tabela videos: ID, título, URL, materiais relacionados, idade recomendada, duração, descrição, thumbnail
- Tabela usuarios: ID, dados pessoais, tipo de plano, contadores de uso

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Usuários autenticados podem ler materiais e vídeos, apenas próprios dados de usuário

## Performance Impact:
- Indexes: Added on frequently queried columns
- Triggers: None initially
- Estimated Impact: Minimal - estrutura inicial limpa
*/

-- Criação da tabela de materiais
CREATE TABLE IF NOT EXISTS materiais (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de vídeos
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    video_url TEXT NOT NULL,
    materiais TEXT[] NOT NULL DEFAULT '{}',
    idade_recomendada VARCHAR(50) NOT NULL,
    duracao INTEGER NOT NULL, -- em minutos
    descricao TEXT,
    thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tipo_plano VARCHAR(20) DEFAULT 'gratuito' CHECK (tipo_plano IN ('gratuito', 'premium')),
    videos_assistidos_no_mes INTEGER DEFAULT 0,
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    auth_provider VARCHAR(50) NOT NULL
);

-- Habilitar RLS nas tabelas
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela materiais (leitura pública)
CREATE POLICY "Materiais são públicos para leitura" ON materiais
    FOR SELECT USING (true);

-- Políticas para tabela videos (leitura pública)
CREATE POLICY "Videos são públicos para leitura" ON videos
    FOR SELECT USING (true);

-- Políticas para tabela usuarios (cada usuário acessa apenas seus dados)
CREATE POLICY "Usuários podem ver apenas seus próprios dados" ON usuarios
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios dados" ON usuarios
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Usuários podem inserir seus próprios dados" ON usuarios
    FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Inserção de dados iniciais - Materiais
INSERT INTO materiais (nome, emoji) VALUES
    ('Papelão', '📦'),
    ('Tampinha', '🧃'),
    ('Garrafa PET', '🥤'),
    ('Balão', '🎈'),
    ('Papel', '✂️'),
    ('Linha', '🧵'),
    ('Rolo de Papel', '🧻'),
    ('Lata', '🥫'),
    ('CD/DVD', '💿'),
    ('Caixa de Ovos', '🥚')
ON CONFLICT DO NOTHING;

-- Inserção de dados iniciais - Vídeos
INSERT INTO videos (titulo, video_url, materiais, idade_recomendada, duracao, descricao, thumbnail) VALUES
    (
        'Robô de Papelão',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        ARRAY[(SELECT id::text FROM materiais WHERE nome = 'Papelão'), (SELECT id::text FROM materiais WHERE nome = 'Tampinha'), (SELECT id::text FROM materiais WHERE nome = 'Papel')],
        '4-8 anos',
        15,
        'Crie um robô incrível usando caixas de papelão e materiais simples!',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop&crop=center'
    ),
    (
        'Jogo da Memória com Tampinhas',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        ARRAY[(SELECT id::text FROM materiais WHERE nome = 'Tampinha'), (SELECT id::text FROM materiais WHERE nome = 'Papel')],
        '3-10 anos',
        10,
        'Um jogo educativo e divertido usando tampinhas coloridas!',
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=200&fit=crop&crop=center'
    ),
    (
        'Vaso de Flores Ecológico',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        ARRAY[(SELECT id::text FROM materiais WHERE nome = 'Garrafa PET'), (SELECT id::text FROM materiais WHERE nome = 'Papel')],
        '5-12 anos',
        20,
        'Transforme garrafas PET em lindos vasos para suas plantas!',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop&crop=center'
    ),
    (
        'Foguete Espacial',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        ARRAY[(SELECT id::text FROM materiais WHERE nome = 'Papelão'), (SELECT id::text FROM materiais WHERE nome = 'Balão'), (SELECT id::text FROM materiais WHERE nome = 'Papel')],
        '6-10 anos',
        25,
        'Construa um foguete que realmente voa usando materiais recicláveis!',
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop&crop=center'
    ),
    (
        'Binóculos de Aventureiro',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        ARRAY[(SELECT id::text FROM materiais WHERE nome = 'Rolo de Papel'), (SELECT id::text FROM materiais WHERE nome = 'Linha'), (SELECT id::text FROM materiais WHERE nome = 'Papel')],
        '4-9 anos',
        12,
        'Crie binóculos funcionais para as aventuras do seu pequeno explorador!',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center'
    )
ON CONFLICT DO NOTHING;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_videos_materiais ON videos USING GIN (materiais);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo_plano ON usuarios (tipo_plano);
CREATE INDEX IF NOT EXISTS idx_videos_titulo ON videos (titulo);
