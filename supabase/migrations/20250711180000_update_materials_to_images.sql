/*
          # [Operation Name]
          Update Materials Table to Use Image URLs

          ## Query Description: [This migration updates the 'materiais' table to use image URLs instead of emojis. It involves dropping the old table, recreating it with an 'image_url' column, and reseeding it with new data containing links to real images. This change will not result in data loss as it only affects seed data.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: false
          - Reversible: false
          
          ## Structure Details:
          - Drops the existing 'public.materiais' table.
          - Recreates the 'public.materiais' table with the following columns: id (TEXT, PK), nome (TEXT), image_url (TEXT), created_at (TIMESTAMPTZ).
          - Re-enables Row Level Security (RLS) on the new table.
          - Creates a read-only policy for public access.
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (re-creation of public read policy)
          - Auth Requirements: None for reading materials.
          
          ## Performance Impact:
          - Indexes: Primary key index is recreated.
          - Triggers: None
          - Estimated Impact: Low. Table is small.
          */

-- 1. Drop the old table
DROP TABLE IF EXISTS public.materiais;

-- 2. Create the new table with image_url
CREATE TABLE public.materiais (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable RLS and create policy
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to materials"
ON public.materiais
FOR SELECT
TO public
USING (true);

-- 4. Insert new data with image URLs
INSERT INTO public.materiais (id, nome, image_url) VALUES
('papelao', 'Papelão', 'https://images.unsplash.com/photo-1594212695909-a12a3d3890e0?w=120&h=120&fit=crop&q=80'),
('tampinha', 'Tampinha', 'https://images.unsplash.com/photo-1618336913747-74a7433b5cf90?w=120&h=120&fit=crop&q=80'),
('garrafa-pet', 'Garrafa PET', 'https://images.unsplash.com/photo-1605640134065-24333651e04a?w=120&h=120&fit=crop&q=80'),
('balao', 'Balão', 'https://images.unsplash.com/photo-1518883733083-36b133c1f237?w=120&h=120&fit=crop&q=80'),
('papel', 'Papel', 'https://images.unsplash.com/photo-1585331505473-7586f823a234?w=120&h=120&fit=crop&q=80'),
('linha', 'Linha', 'https://images.unsplash.com/photo-1599842692593-2287c14f9e6e?w=120&h=120&fit=crop&q=80'),
('rolo-de-papel', 'Rolo de Papel', 'https://images.unsplash.com/photo-1629226349094-a70c70d4e995?w=120&h=120&fit=crop&q=80'),
('lata', 'Lata', 'https://images.unsplash.com/photo-1581636625423-5351a9341315?w=120&h=120&fit=crop&q=80'),
('cd-dvd', 'CD/DVD', 'https://images.unsplash.com/photo-1543973050-d4f7c1990c74?w=120&h=120&fit=crop&q=80'),
('caixa-de-ovos', 'Caixa de Ovos', 'https://images.unsplash.com/photo-1605502095988-7094033c4b57?w=120&h=120&fit=crop&q=80');
