-- =========================
-- CATEGORIAS PRINCIPAIS
-- =========================

INSERT INTO categories (name, slug, description, color, parent_id) VALUES
('Lisboa, Cidade Aberta', 'lisboa-cidade-aberta', 'Reportagens e histórias sobre a cidade.', '#1E90FF', NULL),
('A Fundo', 'a-fundo', 'Análises e investigações em profundidade.', '#FF5733', NULL),
('Especiais', 'especiais', 'Conteúdos especiais e séries temáticas.', '#8E44AD', NULL),
('Fotografia', 'fotografia', 'Ensaios visuais e narrativas fotográficas.', '#2ECC71', NULL),
('Podcasts', 'podcasts', 'Conversas, entrevistas e histórias em áudio.', '#F39C12', NULL),
('Mundo', 'mundo', 'Atualidade e acontecimentos internacionais.', '#3B82F6', NULL),
('Política', 'politica', 'Cobertura da vida política e institucional.', '#EF4444', NULL),
('Sociedade', 'sociedade', 'Temas sociais com impacto no quotidiano.', '#10B981', NULL),
('Cultura', 'cultura', 'Artes, livros, cinema e criação cultural.', '#A855F7', NULL),
('Media', 'media', 'Jornalismo, comunicação e indústria dos media.', '#F59E0B', NULL),
('Desportos', 'desportos', 'Notícias, contexto e protagonistas do desporto.', '#06B6D4', NULL);

-- =========================
-- SUBCATEGORIAS DE "Sociedade"
-- =========================

INSERT INTO categories (name, slug, description, color, parent_id) VALUES
('Educação', 'educacao', 'Escolas, ensino e políticas educativas.', '#6366F1',
 (SELECT id FROM categories WHERE slug = 'sociedade')
),
('Saúde', 'saude', 'Serviços de saúde, cuidados e políticas públicas.', '#EC4899',
 (SELECT id FROM categories WHERE slug = 'sociedade')
),
('Habitação', 'habitacao', 'Casa, rendas e acesso à habitação.', '#84CC16',
 (SELECT id FROM categories WHERE slug = 'sociedade')
),
('Justiça', 'justica', 'Tribunais, leis e sistema judicial.', '#F97316',
 (SELECT id FROM categories WHERE slug = 'sociedade')
),
('Ambiente', 'ambiente', 'Clima, território e sustentabilidade.', '#22C55E',
 (SELECT id FROM categories WHERE slug = 'sociedade')
);

-- =========================
-- TAGS
-- =========================

INSERT INTO tags (name, slug, description) VALUES
('Lisboa', 'lisboa', 'Conteúdos relacionados com a cidade de Lisboa'),
('Portugal', 'portugal', 'Notícias e temas nacionais'),
('Política', 'politica', 'Cobertura política e decisões governamentais'),
('Sociedade', 'sociedade', 'Temas sociais e questões do dia a dia'),
('Cultura', 'cultura', 'Arte, música, cinema e eventos culturais'),
('Economia', 'economia', 'Negócios, finanças e economia'),
('Tecnologia', 'tecnologia', 'Inovação, startups e tecnologia'),
('Ambiente', 'ambiente', 'Sustentabilidade e meio ambiente'),
('Educação', 'educacao', 'Ensino, escolas e universidades'),
('Saúde', 'saude', 'Sistema de saúde e bem-estar'),
('Habitação', 'habitacao', 'Mercado imobiliário e acesso à habitação'),
('Justiça', 'justica', 'Sistema judicial e leis'),
('Desporto', 'desporto', 'Eventos e notícias desportivas'),
('Opinião', 'opiniao', 'Artigos de opinião e colunas'),
('Entrevista', 'entrevista', 'Conversas e entrevistas exclusivas'),
('Reportagem', 'reportagem', 'Reportagens aprofundadas'),
('Breaking News', 'breaking-news', 'Notícias de última hora'),
('Investigação', 'investigacao', 'Jornalismo investigativo'),
('Internacional', 'internacional', 'Notícias fora de Portugal'),
('Media', 'media', 'Indústria dos media e comunicação');
