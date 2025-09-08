/*
# Atualização das URLs dos Vídeos

Atualiza as URLs dos vídeos para usar placeholders que funcionam no ambiente de desenvolvimento.

## Query Description: 
Esta operação atualiza as URLs dos vídeos existentes para usar placeholders funcionais. É uma operação segura que não afeta dados críticos e melhora a experiência do usuário no ambiente de desenvolvimento.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"  
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: videos
- Column: video_url (updated URLs)
- No structural changes

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: No changes

## Performance Impact:
- Indexes: No changes
- Triggers: No changes  
- Estimated Impact: Minimal - simple UPDATE operation
*/

-- Atualizar as URLs dos vídeos para placeholders que funcionam
UPDATE videos SET 
  video_url = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
  thumbnail = CASE 
    WHEN id = '1' THEN 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    WHEN id = '2' THEN 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop'
    WHEN id = '3' THEN 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop'
    WHEN id = '4' THEN 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop'
    WHEN id = '5' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    WHEN id = '6' THEN 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop'
    WHEN id = '7' THEN 'https://images.unsplash.com/photo-1562184552-c4b0b3e8c444?w=400&h=300&fit=crop'
    WHEN id = '8' THEN 'https://images.unsplash.com/photo-1564121403979-e1b11194b15b?w=400&h=300&fit=crop'
    ELSE thumbnail
  END
WHERE id IN ('1', '2', '3', '4', '5', '6', '7', '8');
