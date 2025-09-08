-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Materiais
CREATE TABLE IF NOT EXISTS materiais (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Vídeos
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  video_url TEXT NOT NULL,
  materiais TEXT[] NOT NULL,
  idade_recomendada VARCHAR(50) NOT NULL,
  duracao INTEGER NOT NULL,
  descricao TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  tipo_plano VARCHAR(20) DEFAULT 'gratuito' CHECK (tipo_plano IN ('gratuito', 'premium')),
  videos_assistidos_no_mes INTEGER DEFAULT 0,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auth_provider VARCHAR(50) NOT NULL
);

-- Inserir dados iniciais de materiais
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

-- Inserir dados iniciais de vídeos
INSERT INTO videos (titulo, video_url, materiais, idade_recomendada, duracao, descricao, thumbnail) 
SELECT 
  'Robô de Papelão',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  ARRAY[m1.id::text, m2.id::text, m5.id::text],
  '4-8 anos',
  15,
  'Crie um robô incrível usando caixas de papelão e materiais simples!',
  'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/green/white?text=Robô+de+Papelão'
FROM 
  (SELECT id FROM materiais WHERE nome = 'Papelão') m1,
  (SELECT id FROM materiais WHERE nome = 'Tampinha') m2,
  (SELECT id FROM materiais WHERE nome = 'Papel') m5
WHERE NOT EXISTS (SELECT 1 FROM videos WHERE titulo = 'Robô de Papelão');

INSERT INTO videos (titulo, video_url, materiais, idade_recomendada, duracao, descricao, thumbnail) 
SELECT 
  'Jogo da Memória com Tampinhas',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  ARRAY[m2.id::text, m5.id::text],
  '3-10 anos',
  10,
  'Um jogo educativo e divertido usando tampinhas coloridas!',
  'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/blue/white?text=Jogo+da+Memória'
FROM 
  (SELECT id FROM materiais WHERE nome = 'Tampinha') m2,
  (SELECT id FROM materiais WHERE nome = 'Papel') m5
WHERE NOT EXISTS (SELECT 1 FROM videos WHERE titulo = 'Jogo da Memória com Tampinhas');

INSERT INTO videos (titulo, video_url, materiais, idade_recomendada, duracao, descricao, thumbnail) 
SELECT 
  'Vaso de Flores Ecológico',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  ARRAY[m3.id::text, m5.id::text],
  '5-12 anos',
  20,
  'Transforme garrafas PET em lindos vasos para suas plantas!',
  'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/green/white?text=Vaso+Ecológico'
FROM 
  (SELECT id FROM materiais WHERE nome = 'Garrafa PET') m3,
  (SELECT id FROM materiais WHERE nome = 'Papel') m5
WHERE NOT EXISTS (SELECT 1 FROM videos WHERE titulo = 'Vaso de Flores Ecológico');

INSERT INTO videos (titulo, video_url, materiais, idade_recomendada, duracao, descricao, thumbnail) 
SELECT 
  'Foguete Espacial',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  ARRAY[m1.id::text, m4.id::text, m5.id::text],
  '6-10 anos',
  25,
  'Construa um foguete que realmente voa usando materiais recicláveis!',
  'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/red/white?text=Foguete+Espacial'
FROM 
  (SELECT id FROM materiais WHERE nome = 'Papelão') m1,
  (SELECT id FROM materiais WHERE nome = 'Balão') m4,
  (SELECT id FROM materiais WHERE nome = 'Papel') m5
WHERE NOT EXISTS (SELECT 1 FROM videos WHERE titulo = 'Foguete Espacial');

INSERT INTO videos (titulo, video_url, materiais, idade_recomendada, duracao, descricao, thumbnail) 
SELECT 
  'Binóculos de Aventureiro',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  ARRAY[m7.id::text, m6.id::text, m5.id::text],
  '4-9 anos',
  12,
  'Crie binóculos funcionais para as aventuras do seu pequeno explorador!',
  'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/orange/white?text=Binóculos'
FROM 
  (SELECT id FROM materiais WHERE nome = 'Rolo de Papel') m7,
  (SELECT id FROM materiais WHERE nome = 'Linha') m6,
  (SELECT id FROM materiais WHERE nome = 'Papel') m5
WHERE NOT EXISTS (SELECT 1 FROM videos WHERE titulo = 'Binóculos de Aventureiro');

-- Habilitar RLS (Row Level Security)
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (permitir leitura para todos)
CREATE POLICY "Permitir leitura de materiais" ON materiais FOR SELECT USING (true);
CREATE POLICY "Permitir leitura de vídeos" ON videos FOR SELECT USING (true);

-- Políticas para usuários (só podem ver/editar seus próprios dados)
CREATE POLICY "Usuários podem ver próprios dados" ON usuarios FOR SELECT USING (id = auth.uid()::text);
CREATE POLICY "Usuários podem atualizar próprios dados" ON usuarios FOR UPDATE USING (id = auth.uid()::text);
CREATE POLICY "Usuários podem inserir próprios dados" ON usuarios FOR INSERT WITH CHECK (id = auth.uid()::text);
