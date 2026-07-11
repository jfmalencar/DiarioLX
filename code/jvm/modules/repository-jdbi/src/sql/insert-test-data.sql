-- Diário LX — Seed v2
-- Gera mais dados para homepage, categorias, artigos e vídeos.
-- Pressupõe as mesmas tabelas/enums do seed atual.
-- Imagens: seed/001.jpg ... seed/010.jpg
-- Vídeos: seed/001.mp4 e seed/002.mp4



-- Categorias

INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Lisboa, a Cidade Aberta','lisboa-cidade-aberta','Reportagens e histórias sobre a cidade.','#1E90FF',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('A Fundo','a-fundo','Análises e investigações em profundidade.','#FF5733',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Especiais','especiais','Conteúdos especiais e séries temáticas.','#8E44AD',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Fotografia','fotografia','Ensaios visuais e narrativas fotográficas.','#2ECC71',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Mundo','mundo','Atualidade e acontecimentos internacionais.','#3B82F6',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Política','politica','Cobertura da vida política e institucional.','#EF4444',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Sociedade','sociedade','Temas sociais com impacto no quotidiano.','#10B981',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Cultura','cultura','Artes, livros, cinema e criação cultural.','#A855F7',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Media','media','Jornalismo, comunicação e indústria dos media.','#F59E0B',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Desportos','desportos','Notícias, contexto e protagonistas do desporto.','#06B6D4',NULL);
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Educação','educacao','Escolas, ensino e políticas educativas.','#6366F1',(SELECT id FROM categories WHERE slug = 'sociedade'));
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Saúde','saude','Serviços de saúde, cuidados e políticas públicas.','#EC4899',(SELECT id FROM categories WHERE slug = 'sociedade'));
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Habitação','habitacao','Casa, rendas e acesso à habitação.','#84CC16',(SELECT id FROM categories WHERE slug = 'sociedade'));
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Justiça','justica','Tribunais, leis e sistema judicial.','#F97316',(SELECT id FROM categories WHERE slug = 'sociedade'));
INSERT INTO categories (name, slug, description, color, parent_id) VALUES ('Ambiente','ambiente','Clima, território e sustentabilidade.','#22C55E',(SELECT id FROM categories WHERE slug = 'sociedade'));

-- Tags

INSERT INTO tags (name, slug, description) VALUES ('Lisboa','lisboa','Conteúdos relacionados com a cidade de Lisboa');
INSERT INTO tags (name, slug, description) VALUES ('Portugal','portugal','Notícias e temas nacionais');
INSERT INTO tags (name, slug, description) VALUES ('Política','politica','Cobertura política e decisões governamentais');
INSERT INTO tags (name, slug, description) VALUES ('Sociedade','sociedade','Temas sociais e questões do dia a dia');
INSERT INTO tags (name, slug, description) VALUES ('Cultura','cultura','Arte, música, cinema e eventos culturais');
INSERT INTO tags (name, slug, description) VALUES ('Economia','economia','Negócios, finanças e economia');
INSERT INTO tags (name, slug, description) VALUES ('Tecnologia','tecnologia','Inovação, startups e tecnologia');
INSERT INTO tags (name, slug, description) VALUES ('Ambiente','ambiente','Sustentabilidade e meio ambiente');
INSERT INTO tags (name, slug, description) VALUES ('Educação','educacao','Ensino, escolas e universidades');
INSERT INTO tags (name, slug, description) VALUES ('Saúde','saude','Sistema de saúde e bem-estar');
INSERT INTO tags (name, slug, description) VALUES ('Habitação','habitacao','Mercado imobiliário e acesso à habitação');
INSERT INTO tags (name, slug, description) VALUES ('Justiça','justica','Sistema judicial e leis');
INSERT INTO tags (name, slug, description) VALUES ('Desporto','desporto','Eventos e notícias desportivas');
INSERT INTO tags (name, slug, description) VALUES ('Opinião','opiniao','Artigos de opinião e colunas');
INSERT INTO tags (name, slug, description) VALUES ('Entrevista','entrevista','Conversas e entrevistas exclusivas');
INSERT INTO tags (name, slug, description) VALUES ('Reportagem','reportagem','Reportagens aprofundadas');
INSERT INTO tags (name, slug, description) VALUES ('Breaking News','breaking-news','Notícias de última hora');
INSERT INTO tags (name, slug, description) VALUES ('Investigação','investigacao','Jornalismo investigativo');
INSERT INTO tags (name, slug, description) VALUES ('Internacional','internacional','Notícias fora de Portugal');
INSERT INTO tags (name, slug, description) VALUES ('Media','media','Indústria dos media e comunicação');
INSERT INTO tags (name, slug, description) VALUES ('Urbanismo','urbanismo','Planeamento urbano e transformação da cidade');
INSERT INTO tags (name, slug, description) VALUES ('Mobilidade','mobilidade','Transportes, ciclovias e deslocações urbanas');
INSERT INTO tags (name, slug, description) VALUES ('Transportes','transportes','Metro, comboios, autocarros e mobilidade pública');
INSERT INTO tags (name, slug, description) VALUES ('Turismo','turismo','Turismo, visitantes e impacto local');
INSERT INTO tags (name, slug, description) VALUES ('Bairros','bairros','Vida nos bairros e comunidades locais');
INSERT INTO tags (name, slug, description) VALUES ('Património','patrimonio','História, memória e património urbano');
INSERT INTO tags (name, slug, description) VALUES ('IA','ia','Inteligência artificial e inovação tecnológica');
INSERT INTO tags (name, slug, description) VALUES ('Startups','startups','Empreendedorismo e novas empresas');
INSERT INTO tags (name, slug, description) VALUES ('Cinema','cinema','Cinema, salas e festivais');
INSERT INTO tags (name, slug, description) VALUES ('Livros','livros','Literatura, autores e livrarias');
INSERT INTO tags (name, slug, description) VALUES ('Música','musica','Concertos, artistas e programação musical');
INSERT INTO tags (name, slug, description) VALUES ('Teatro','teatro','Teatro, companhias e palcos');
INSERT INTO tags (name, slug, description) VALUES ('Museus','museus','Museus, exposições e património cultural');
INSERT INTO tags (name, slug, description) VALUES ('Clima','clima','Alterações climáticas e fenómenos extremos');
INSERT INTO tags (name, slug, description) VALUES ('Segurança','seguranca','Segurança pública e proteção civil');
INSERT INTO tags (name, slug, description) VALUES ('Trabalho','trabalho','Emprego, profissões e mercado laboral');
INSERT INTO tags (name, slug, description) VALUES ('Empresas','empresas','Negócios, empresas e gestão');
INSERT INTO tags (name, slug, description) VALUES ('Europa','europa','União Europeia e contexto europeu');
INSERT INTO tags (name, slug, description) VALUES ('Comunidades','comunidades','Associações, vizinhança e participação cívica');
INSERT INTO tags (name, slug, description) VALUES ('Comércio Local','comercio-local','Lojas, mercados e economia de proximidade');

-- Utilizadores adicionais

INSERT INTO users (username, email, role, password_hash, first_name, last_name, bio, active_account, created_at, updated_at) VALUES ('pedro.martins','pedro@example.com','CONTRIBUTOR','$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu','Pedro','Martins','Repórter de cidade.',TRUE,1783527073,1783527073);
INSERT INTO users (username, email, role, password_hash, first_name, last_name, bio, active_account, created_at, updated_at) VALUES ('rita.ferreira','rita@example.com','EDITOR','$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu','Rita','Ferreira','Editora de sociedade.',TRUE,1783527073,1783527073);
INSERT INTO users (username, email, role, password_hash, first_name, last_name, bio, active_account, created_at, updated_at) VALUES ('ines.matos','ines@example.com','CONTRIBUTOR','$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu','Inês','Matos','Jornalista de cultura.',TRUE,1783527073,1783527073);
INSERT INTO users (username, email, role, password_hash, first_name, last_name, bio, active_account, created_at, updated_at) VALUES ('miguel.lopes','miguel@example.com','CONTRIBUTOR','$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu','Miguel','Lopes','Repórter de política.',TRUE,1783527073,1783527073);
INSERT INTO users (username, email, role, password_hash, first_name, last_name, bio, active_account, created_at, updated_at) VALUES ('sofia.almeida','sofia@example.com','EDITOR','$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu','Sofia','Almeida','Editora multimédia.',TRUE,1783527073,1783527073);
INSERT INTO users (username, email, role, password_hash, first_name, last_name, bio, active_account, created_at, updated_at) VALUES ('duarte.neves','duarte@example.com','CONTRIBUTOR','$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu','Duarte','Neves','Jornalista de desporto.',TRUE,1783527073,1783527073);


INSERT INTO users (username, email, role, password_hash, first_name, last_name, bio, active_account, created_at, updated_at) VALUES
    ('tiago.costa', 'tiago@example.com', 'ADMIN', '$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu', 'Tiago', 'Costa', 'Full-stack developer.', TRUE, 1783527073, 1783527073),
    ('ana.silva', 'ana@example.com', 'EDITOR', '$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu', 'Ana', 'Silva', 'UX designer.',  TRUE, 1783527073, 1783527073),
    ('joao.pereira', 'joao@example.com', 'CONTRIBUTOR', '$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu', 'Joao', 'Pereira', 'Writes tech articles.',  TRUE, 1783527073, 1783527073),
    ('maria.oliveira', 'maria@example.com', 'EDITOR', '$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu', 'Maria', 'Oliveira', 'Content strategist.', TRUE, 1783527073, 1783527073),
    ('carlos.santos', 'carlos@example.com', 'CONTRIBUTOR', '$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu', 'Carlos', 'Santos', 'Backend developer.',  TRUE, 1783527073, 1783527073),
    ('lucia.rocha', 'lucia@example.com', 'ADMIN', '$2a$10$zx51.oyueMBIcSjfxsxOJ.rew4kfDdpSDaZcJIGbYTHpJGklWpouu', 'Lucia', 'Rocha', 'Project manager.',  FALSE, 1783527073, 1783527073),
    ('admin', 'admin@diariolx.com', 'ADMIN', '$2a$10$M7ajQwhD7s.V7qAvg6TWiuGaPsTYkivIe87jUWWxOIPoTGDRHjKta', 'Jessé', 'Alencar', 'Administrator account.', TRUE, 1783527073, 1783527073);

INSERT INTO users (username, email, role, password_hash, first_name, last_name, bio, active_account, created_at, updated_at) VALUES ('test.editor', 'test.editor@diariolx.com', 'EDITOR', '$2a$10$M7ajQwhD7s.V7qAvg6TWiuGaPsTYkivIe87jUWWxOIPoTGDRHjKta', 'Test', 'Editor', '', TRUE, 1783527073, 1783527073);
INSERT INTO users (username, email, role, password_hash, first_name, last_name, bio, active_account, created_at, updated_at) VALUES ('test.contributor', 'test.contributor@diariolx.com', 'CONTRIBUTOR', '$2a$10$M7ajQwhD7s.V7qAvg6TWiuGaPsTYkivIe87jUWWxOIPoTGDRHjKta', 'Test', 'Contributor', '', TRUE, 1783527073, 1783527073);

-- ----------------------------------------------------------------------------
-- 1. MEDIAS  (apontam para objetos já existentes no bucket `medias`)
-- ----------------------------------------------------------------------------
INSERT INTO medias
(purpose, original_file_name, bucket, object_key, alt_text, mime_type, status, size_bytes, uploaded_at)
VALUES
    ('GALLERY', '01.jpg', 'media', 'seed/001.jpg', 'Vista do Tejo ao amanhecer',         'image/jpeg', 'ready', 184320, EXTRACT(EPOCH FROM NOW())::bigint),
    ('GALLERY', '02.jpg', 'media', 'seed/002.jpg', 'Elétrico na Baixa de Lisboa',        'image/jpeg', 'ready', 201728, EXTRACT(EPOCH FROM NOW())::bigint),
    ('GALLERY', '03.jpg', 'media', 'seed/003.jpg', 'Mercado da Ribeira ao final do dia',  'image/jpeg', 'ready', 176640, EXTRACT(EPOCH FROM NOW())::bigint),
    ('GALLERY', '04.jpg', 'media', 'seed/004.jpg', 'Estúdio de podcast do Diário LX',     'image/jpeg', 'ready', 158720, EXTRACT(EPOCH FROM NOW())::bigint),
    ('GALLERY', '05.jpg', 'media', 'seed/005.jpg', 'Plano da reportagem em vídeo',        'image/jpeg', 'ready', 220160, EXTRACT(EPOCH FROM NOW())::bigint),
    ('GALLERY', '06.jpg', 'media', 'seed/006.jpg', 'Bairro de Alfama visto de cima',      'image/jpeg', 'ready', 195584, EXTRACT(EPOCH FROM NOW())::bigint);

INSERT INTO medias (purpose, original_file_name, bucket, object_key, alt_text, mime_type, status, size_bytes, uploaded_at) VALUES ('GALLERY','07.jpg','media','seed/007.jpg','Rua de Lisboa ao fim da tarde','image/jpeg','ready',205100,EXTRACT(EPOCH FROM NOW())::bigint);
INSERT INTO medias (purpose, original_file_name, bucket, object_key, alt_text, mime_type, status, size_bytes, uploaded_at) VALUES ('GALLERY','08.jpg','media','seed/008.jpg','Interior de uma livraria independente','image/jpeg','ready',189900,EXTRACT(EPOCH FROM NOW())::bigint);
INSERT INTO medias (purpose, original_file_name, bucket, object_key, alt_text, mime_type, status, size_bytes, uploaded_at) VALUES ('GALLERY','09.jpg','media','seed/009.jpg','Pessoas numa ciclovia junto ao rio','image/jpeg','ready',210450,EXTRACT(EPOCH FROM NOW())::bigint);
INSERT INTO medias (purpose, original_file_name, bucket, object_key, alt_text, mime_type, status, size_bytes, uploaded_at) VALUES ('GALLERY','10.jpg','media','seed/010.jpg','Plateia de teatro antes do espetáculo','image/jpeg','ready',198320,EXTRACT(EPOCH FROM NOW())::bigint);
INSERT INTO medias (purpose, original_file_name, bucket, object_key, alt_text, mime_type, status, size_bytes, uploaded_at) VALUES ('GALLERY','001.mp4','media','seed/001.mp4','Vídeo reportagem sobre Lisboa','video/mp4','ready',5242880,EXTRACT(EPOCH FROM NOW())::bigint);
INSERT INTO medias (purpose, original_file_name, bucket, object_key, alt_text, mime_type, status, size_bytes, uploaded_at) VALUES ('GALLERY','002.mp4','media','seed/002.mp4','Vídeo entrevista em estúdio','video/mp4','ready',7340032,EXTRACT(EPOCH FROM NOW())::bigint);

-- Conteúdos


-- 01. ARTICLE — A transformação silenciosa da Avenida Almirante Reis
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'A transformação silenciosa da Avenida Almirante Reis',
    'Novos negócios, mais transportes e uma pressão crescente sobre quem vive na zona.',
    (SELECT id FROM medias WHERE object_key = 'seed/007.jpg'),
    'transformacao-silenciosa-avenida-almirante-reis',
    (SELECT id FROM categories WHERE slug = 'lisboa-cidade-aberta'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-3 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Novos negócios, mais transportes e uma pressão crescente sobre quem vive na zona. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/004.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'tiago.costa'
WHERE c.slug = 'transformacao-silenciosa-avenida-almirante-reis'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'transformacao-silenciosa-avenida-almirante-reis'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'urbanismo' WHERE c.slug = 'transformacao-silenciosa-avenida-almirante-reis'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'bairros' WHERE c.slug = 'transformacao-silenciosa-avenida-almirante-reis';


-- 02. ARTICLE — O mercado de Arroios reinventou-se sem perder a alma
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'O mercado de Arroios reinventou-se sem perder a alma',
    'Entre bancas tradicionais e novas cozinhas, o mercado procura equilibrar memória e mudança.',
    (SELECT id FROM medias WHERE object_key = 'seed/003.jpg'),
    'mercado-arroios-reinventou-se',
    (SELECT id FROM categories WHERE slug = 'lisboa-cidade-aberta'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-8 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Entre bancas tradicionais e novas cozinhas, o mercado procura equilibrar memória e mudança. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/005.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'ana.silva'
WHERE c.slug = 'mercado-arroios-reinventou-se'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'mercado-arroios-reinventou-se'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'comercio-local' WHERE c.slug = 'mercado-arroios-reinventou-se'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'bairros' WHERE c.slug = 'mercado-arroios-reinventou-se';


-- 03. ARTICLE — A nova vida dos quiosques históricos
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'A nova vida dos quiosques históricos',
    'Pequenos pontos de encontro voltam a ocupar jardins e praças da cidade.',
    (SELECT id FROM medias WHERE object_key = 'seed/002.jpg'),
    'nova-vida-quiosques-historicos',
    (SELECT id FROM categories WHERE slug = 'lisboa-cidade-aberta'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-15 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Pequenos pontos de encontro voltam a ocupar jardins e praças da cidade. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/006.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'joao.pereira'
WHERE c.slug = 'nova-vida-quiosques-historicos'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'nova-vida-quiosques-historicos'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'patrimonio' WHERE c.slug = 'nova-vida-quiosques-historicos'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'cultura' WHERE c.slug = 'nova-vida-quiosques-historicos';


-- 04. ARTICLE — Marvila atrai empresas, artistas e novos moradores
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Marvila atrai empresas, artistas e novos moradores',
    'A zona oriental vive uma mudança rápida, mas a convivência entre usos nem sempre é simples.',
    (SELECT id FROM medias WHERE object_key = 'seed/006.jpg'),
    'marvila-empresas-artistas-moradores',
    (SELECT id FROM categories WHERE slug = 'lisboa-cidade-aberta'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-21 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'A zona oriental vive uma mudança rápida, mas a convivência entre usos nem sempre é simples. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/007.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'maria.oliveira'
WHERE c.slug = 'marvila-empresas-artistas-moradores'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'marvila-empresas-artistas-moradores'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'startups' WHERE c.slug = 'marvila-empresas-artistas-moradores'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'urbanismo' WHERE c.slug = 'marvila-empresas-artistas-moradores';


-- 05. ARTICLE — Como a cidade se prepara para mais ondas de calor
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Como a cidade se prepara para mais ondas de calor',
    'Sombras, água e espaços verdes entram no centro do debate urbano.',
    (SELECT id FROM medias WHERE object_key = 'seed/009.jpg'),
    'lisboa-prepara-ondas-calor',
    (SELECT id FROM categories WHERE slug = 'sociedade'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-4 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Sombras, água e espaços verdes entram no centro do debate urbano. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/008.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'carlos.santos'
WHERE c.slug = 'lisboa-prepara-ondas-calor'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'clima' WHERE c.slug = 'lisboa-prepara-ondas-calor'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'ambiente' WHERE c.slug = 'lisboa-prepara-ondas-calor'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'lisboa-prepara-ondas-calor';


-- 06. ARTICLE — Habitação: o mapa das rendas que mudou Lisboa
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Habitação: o mapa das rendas que mudou Lisboa',
    'Os bairros centrais concentram a maior pressão, mas a periferia começa a sentir o mesmo movimento.',
    (SELECT id FROM medias WHERE object_key = 'seed/001.jpg'),
    'mapa-rendas-mudou-lisboa',
    (SELECT id FROM categories WHERE slug = 'a-fundo'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-10 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Os bairros centrais concentram a maior pressão, mas a periferia começa a sentir o mesmo movimento. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/009.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'pedro.martins'
WHERE c.slug = 'mapa-rendas-mudou-lisboa'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'habitacao' WHERE c.slug = 'mapa-rendas-mudou-lisboa'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'investigacao' WHERE c.slug = 'mapa-rendas-mudou-lisboa'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'mapa-rendas-mudou-lisboa';


-- 07. ARTICLE — Quem controla o alojamento local?
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Quem controla o alojamento local?',
    'Uma análise aos registos, às empresas e ao peso económico nos bairros históricos.',
    (SELECT id FROM medias WHERE object_key = 'seed/005.jpg'),
    'quem-controla-alojamento-local',
    (SELECT id FROM categories WHERE slug = 'a-fundo'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-18 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Uma análise aos registos, às empresas e ao peso económico nos bairros históricos. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/010.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'rita.ferreira'
WHERE c.slug = 'quem-controla-alojamento-local'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'turismo' WHERE c.slug = 'quem-controla-alojamento-local'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'investigacao' WHERE c.slug = 'quem-controla-alojamento-local'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'habitacao' WHERE c.slug = 'quem-controla-alojamento-local';


-- 08. ARTICLE — Mobilidade em Lisboa: dez anos de promessas e atrasos
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Mobilidade em Lisboa: dez anos de promessas e atrasos',
    'Entre metro, autocarros e ciclovias, a cidade avança em ritmos diferentes.',
    (SELECT id FROM medias WHERE object_key = 'seed/008.jpg'),
    'mobilidade-lisboa-dez-anos-promessas-atrasos',
    (SELECT id FROM categories WHERE slug = 'a-fundo'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-28 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Entre metro, autocarros e ciclovias, a cidade avança em ritmos diferentes. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/001.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'ines.matos'
WHERE c.slug = 'mobilidade-lisboa-dez-anos-promessas-atrasos'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'mobilidade' WHERE c.slug = 'mobilidade-lisboa-dez-anos-promessas-atrasos'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'transportes' WHERE c.slug = 'mobilidade-lisboa-dez-anos-promessas-atrasos'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'mobilidade-lisboa-dez-anos-promessas-atrasos';


-- 09. ARTICLE — A escola pública vista por dentro
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'A escola pública vista por dentro',
    'Professores, alunos e famílias descrevem um sistema em esforço permanente.',
    (SELECT id FROM medias WHERE object_key = 'seed/010.jpg'),
    'escola-publica-vista-por-dentro',
    (SELECT id FROM categories WHERE slug = 'educacao'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-11 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Professores, alunos e famílias descrevem um sistema em esforço permanente. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/002.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'miguel.lopes'
WHERE c.slug = 'escola-publica-vista-por-dentro'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'educacao' WHERE c.slug = 'escola-publica-vista-por-dentro'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'sociedade' WHERE c.slug = 'escola-publica-vista-por-dentro'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'reportagem' WHERE c.slug = 'escola-publica-vista-por-dentro';


-- 10. ARTICLE — O futuro do comércio tradicional em Alfama
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'O futuro do comércio tradicional em Alfama',
    'Lojas antigas tentam sobreviver entre turistas, rendas e mudança geracional.',
    (SELECT id FROM medias WHERE object_key = 'seed/002.jpg'),
    'comercio-tradicional-alfama',
    (SELECT id FROM categories WHERE slug = 'sociedade'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-6 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Lojas antigas tentam sobreviver entre turistas, rendas e mudança geracional. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/003.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'sofia.almeida'
WHERE c.slug = 'comercio-tradicional-alfama'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'comercio-local' WHERE c.slug = 'comercio-tradicional-alfama'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'bairros' WHERE c.slug = 'comercio-tradicional-alfama'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'turismo' WHERE c.slug = 'comercio-tradicional-alfama';


-- 11. ARTICLE — Portugal debate nova estratégia para a saúde mental
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Portugal debate nova estratégia para a saúde mental',
    'Especialistas defendem mais respostas comunitárias e menos dependência dos hospitais.',
    (SELECT id FROM medias WHERE object_key = 'seed/004.jpg'),
    'estrategia-saude-mental-portugal',
    (SELECT id FROM categories WHERE slug = 'saude'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-19 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Especialistas defendem mais respostas comunitárias e menos dependência dos hospitais. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/004.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'duarte.neves'
WHERE c.slug = 'estrategia-saude-mental-portugal'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'saude' WHERE c.slug = 'estrategia-saude-mental-portugal'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'portugal' WHERE c.slug = 'estrategia-saude-mental-portugal'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'sociedade' WHERE c.slug = 'estrategia-saude-mental-portugal';


-- 12. ARTICLE — Tribunais digitais prometem acelerar processos
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Tribunais digitais prometem acelerar processos',
    'A transição tecnológica levanta dúvidas sobre acesso, segurança e formação.',
    (SELECT id FROM medias WHERE object_key = 'seed/007.jpg'),
    'tribunais-digitais-processos',
    (SELECT id FROM categories WHERE slug = 'justica'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-23 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'A transição tecnológica levanta dúvidas sobre acesso, segurança e formação. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/005.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'tiago.costa'
WHERE c.slug = 'tribunais-digitais-processos'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'justica' WHERE c.slug = 'tribunais-digitais-processos'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'tecnologia' WHERE c.slug = 'tribunais-digitais-processos'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'portugal' WHERE c.slug = 'tribunais-digitais-processos';


-- 13. ARTICLE — O Parlamento entre consensos raros e linhas vermelhas
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'O Parlamento entre consensos raros e linhas vermelhas',
    'Os principais partidos negoceiam medidas sociais num clima de tensão política.',
    (SELECT id FROM medias WHERE object_key = 'seed/003.jpg'),
    'parlamento-consensos-linhas-vermelhas',
    (SELECT id FROM categories WHERE slug = 'politica'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-2 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Os principais partidos negoceiam medidas sociais num clima de tensão política. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/006.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'ana.silva'
WHERE c.slug = 'parlamento-consensos-linhas-vermelhas'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'politica' WHERE c.slug = 'parlamento-consensos-linhas-vermelhas'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'portugal' WHERE c.slug = 'parlamento-consensos-linhas-vermelhas';


-- 14. ARTICLE — Autárquicas: os bairros voltam ao centro da campanha
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Autárquicas: os bairros voltam ao centro da campanha',
    'Mobilidade, limpeza urbana e habitação dominam as primeiras propostas.',
    (SELECT id FROM medias WHERE object_key = 'seed/001.jpg'),
    'autarquicas-bairros-centro-campanha',
    (SELECT id FROM categories WHERE slug = 'politica'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-13 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Mobilidade, limpeza urbana e habitação dominam as primeiras propostas. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/007.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'joao.pereira'
WHERE c.slug = 'autarquicas-bairros-centro-campanha'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'politica' WHERE c.slug = 'autarquicas-bairros-centro-campanha'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'autarquicas-bairros-centro-campanha'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'bairros' WHERE c.slug = 'autarquicas-bairros-centro-campanha';


-- 15. ARTICLE — Europa reforça regras para plataformas digitais
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Europa reforça regras para plataformas digitais',
    'Novas obrigações de transparência chegam às grandes empresas tecnológicas.',
    (SELECT id FROM medias WHERE object_key = 'seed/009.jpg'),
    'europa-regras-plataformas-digitais',
    (SELECT id FROM categories WHERE slug = 'mundo'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-17 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Novas obrigações de transparência chegam às grandes empresas tecnológicas. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/008.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'maria.oliveira'
WHERE c.slug = 'europa-regras-plataformas-digitais'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'europa' WHERE c.slug = 'europa-regras-plataformas-digitais'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'tecnologia' WHERE c.slug = 'europa-regras-plataformas-digitais'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'internacional' WHERE c.slug = 'europa-regras-plataformas-digitais';


-- 16. ARTICLE — A guerra da informação chega às redes locais
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'A guerra da informação chega às redes locais',
    'Desinformação, bots e páginas anónimas preocupam investigadores e jornalistas.',
    (SELECT id FROM medias WHERE object_key = 'seed/005.jpg'),
    'guerra-informacao-redes-locais',
    (SELECT id FROM categories WHERE slug = 'media'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-24 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Desinformação, bots e páginas anónimas preocupam investigadores e jornalistas. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/009.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'carlos.santos'
WHERE c.slug = 'guerra-informacao-redes-locais'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'media' WHERE c.slug = 'guerra-informacao-redes-locais'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'tecnologia' WHERE c.slug = 'guerra-informacao-redes-locais'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'investigacao' WHERE c.slug = 'guerra-informacao-redes-locais';


-- 17. ARTICLE — Como a IA está a transformar as redações portuguesas
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Como a IA está a transformar as redações portuguesas',
    'Ferramentas de automação ajudam na produção, mas levantam perguntas sobre transparência.',
    (SELECT id FROM medias WHERE object_key = 'seed/004.jpg'),
    'ia-transformar-redacoes-portuguesas',
    (SELECT id FROM categories WHERE slug = 'media'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-9 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Ferramentas de automação ajudam na produção, mas levantam perguntas sobre transparência. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/010.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'pedro.martins'
WHERE c.slug = 'ia-transformar-redacoes-portuguesas'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'ia' WHERE c.slug = 'ia-transformar-redacoes-portuguesas'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'media' WHERE c.slug = 'ia-transformar-redacoes-portuguesas'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'tecnologia' WHERE c.slug = 'ia-transformar-redacoes-portuguesas';


-- 18. ARTICLE — Museu prepara exposição sobre Lisboa oitocentista
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Museu prepara exposição sobre Lisboa oitocentista',
    'A mostra reúne mapas, fotografias e objetos raros da cidade em transformação.',
    (SELECT id FROM medias WHERE object_key = 'seed/008.jpg'),
    'museu-exposicao-lisboa-oitocentista',
    (SELECT id FROM categories WHERE slug = 'cultura'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-14 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'A mostra reúne mapas, fotografias e objetos raros da cidade em transformação. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/001.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'rita.ferreira'
WHERE c.slug = 'museu-exposicao-lisboa-oitocentista'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'museus' WHERE c.slug = 'museu-exposicao-lisboa-oitocentista'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'museu-exposicao-lisboa-oitocentista'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'patrimonio' WHERE c.slug = 'museu-exposicao-lisboa-oitocentista';


-- 19. ARTICLE — As livrarias independentes que resistem no centro
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'As livrarias independentes que resistem no centro',
    'Programação cultural e comunidade ajudam a manter portas abertas.',
    (SELECT id FROM medias WHERE object_key = 'seed/008.jpg'),
    'livrarias-independentes-resistem-centro',
    (SELECT id FROM categories WHERE slug = 'cultura'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-20 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Programação cultural e comunidade ajudam a manter portas abertas. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/002.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'ines.matos'
WHERE c.slug = 'livrarias-independentes-resistem-centro'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'livros' WHERE c.slug = 'livrarias-independentes-resistem-centro'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'comercio-local' WHERE c.slug = 'livrarias-independentes-resistem-centro'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'cultura' WHERE c.slug = 'livrarias-independentes-resistem-centro';


-- 20. ARTICLE — O teatro regressa aos palcos de bairro
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'O teatro regressa aos palcos de bairro',
    'Companhias independentes procuram novos públicos fora dos grandes equipamentos.',
    (SELECT id FROM medias WHERE object_key = 'seed/010.jpg'),
    'teatro-palcos-bairro',
    (SELECT id FROM categories WHERE slug = 'cultura'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-25 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Companhias independentes procuram novos públicos fora dos grandes equipamentos. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/003.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'miguel.lopes'
WHERE c.slug = 'teatro-palcos-bairro'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'teatro' WHERE c.slug = 'teatro-palcos-bairro'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'bairros' WHERE c.slug = 'teatro-palcos-bairro'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'cultura' WHERE c.slug = 'teatro-palcos-bairro';


-- 21. ARTICLE — Especial: um verão à beira-Tejo
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Especial: um verão à beira-Tejo',
    'Roteiro de jardins, praias fluviais, esplanadas e percursos para dias longos.',
    (SELECT id FROM medias WHERE object_key = 'seed/001.jpg'),
    'verao-a-beira-tejo',
    (SELECT id FROM categories WHERE slug = 'especiais'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-5 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Roteiro de jardins, praias fluviais, esplanadas e percursos para dias longos. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/004.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'sofia.almeida'
WHERE c.slug = 'verao-a-beira-tejo'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'verao-a-beira-tejo'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'turismo' WHERE c.slug = 'verao-a-beira-tejo'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'ambiente' WHERE c.slug = 'verao-a-beira-tejo';


-- 22. ARTICLE — Especial 25 de Abril: memórias da cidade
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Especial 25 de Abril: memórias da cidade',
    'Moradores recordam ruas, vozes e lugares que marcaram a democracia.',
    (SELECT id FROM medias WHERE object_key = 'seed/006.jpg'),
    'especial-25-abril-memorias-cidade',
    (SELECT id FROM categories WHERE slug = 'especiais'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-31 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Moradores recordam ruas, vozes e lugares que marcaram a democracia. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/005.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'duarte.neves'
WHERE c.slug = 'especial-25-abril-memorias-cidade'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'politica' WHERE c.slug = 'especial-25-abril-memorias-cidade'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'patrimonio' WHERE c.slug = 'especial-25-abril-memorias-cidade'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'especial-25-abril-memorias-cidade';


-- 23. ARTICLE — Guia dos miradouros menos óbvios de Lisboa
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Guia dos miradouros menos óbvios de Lisboa',
    'Cinco lugares para ver a cidade sem multidões.',
    (SELECT id FROM medias WHERE object_key = 'seed/007.jpg'),
    'guia-miradouros-menos-obvios-lisboa',
    (SELECT id FROM categories WHERE slug = 'especiais'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-16 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Cinco lugares para ver a cidade sem multidões. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/006.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'tiago.costa'
WHERE c.slug = 'guia-miradouros-menos-obvios-lisboa'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'guia-miradouros-menos-obvios-lisboa'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'turismo' WHERE c.slug = 'guia-miradouros-menos-obvios-lisboa'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'bairros' WHERE c.slug = 'guia-miradouros-menos-obvios-lisboa';


-- 24. ARTICLE — Fotografia: Lisboa antes da manhã começar
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Fotografia: Lisboa antes da manhã começar',
    'Um ensaio visual sobre trabalhadores, ruas vazias e primeiros transportes.',
    (SELECT id FROM medias WHERE object_key = 'seed/010.jpg'),
    'fotografia-lisboa-antes-manha',
    (SELECT id FROM categories WHERE slug = 'fotografia'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-7 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Um ensaio visual sobre trabalhadores, ruas vazias e primeiros transportes. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/007.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'ana.silva'
WHERE c.slug = 'fotografia-lisboa-antes-manha'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'fotografia' WHERE c.slug = 'fotografia-lisboa-antes-manha'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'fotografia-lisboa-antes-manha'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'reportagem' WHERE c.slug = 'fotografia-lisboa-antes-manha';


-- 25. ARTICLE — Benfica e Sporting preparam nova época sob pressão
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Benfica e Sporting preparam nova época sob pressão',
    'Mercado, formação e calendário europeu marcam o arranque dos trabalhos.',
    (SELECT id FROM medias WHERE object_key = 'seed/009.jpg'),
    'benfica-sporting-nova-epoca-pressao',
    (SELECT id FROM categories WHERE slug = 'desportos'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-12 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Mercado, formação e calendário europeu marcam o arranque dos trabalhos. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/008.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'joao.pereira'
WHERE c.slug = 'benfica-sporting-nova-epoca-pressao'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'desporto' WHERE c.slug = 'benfica-sporting-nova-epoca-pressao'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'portugal' WHERE c.slug = 'benfica-sporting-nova-epoca-pressao';


-- 26. ARTICLE — A corrida de rua que mudou a rotina de milhares
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'A corrida de rua que mudou a rotina de milhares',
    'Clubes informais crescem em jardins, avenidas e zonas ribeirinhas.',
    (SELECT id FROM medias WHERE object_key = 'seed/002.jpg'),
    'corrida-rua-rotina-milhares',
    (SELECT id FROM categories WHERE slug = 'desportos'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-27 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Clubes informais crescem em jardins, avenidas e zonas ribeirinhas. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/009.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'maria.oliveira'
WHERE c.slug = 'corrida-rua-rotina-milhares'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'desporto' WHERE c.slug = 'corrida-rua-rotina-milhares'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'corrida-rua-rotina-milhares'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'saude' WHERE c.slug = 'corrida-rua-rotina-milhares';


-- 27. VIDEO — Vídeo: como mudou o Cais do Sodré na última década
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'VIDEO',
    'Vídeo: como mudou o Cais do Sodré na última década',
    'Da noite aos escritórios, o bairro tornou-se símbolo de uma cidade em disputa.',
    (SELECT id FROM medias WHERE object_key = 'seed/001.mp4'),
    'video-cais-sodre-ultima-decada',
    (SELECT id FROM categories WHERE slug = 'lisboa-cidade-aberta'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-1 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Da noite aos escritórios, o bairro tornou-se símbolo de uma cidade em disputa. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 4 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O vídeo acompanha o tema no terreno e reúne imagens, contexto e entrevistas breves com protagonistas da história.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'carlos.santos'
WHERE c.slug = 'video-cais-sodre-ultima-decada'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'video-cais-sodre-ultima-decada'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'reportagem' WHERE c.slug = 'video-cais-sodre-ultima-decada'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'urbanismo' WHERE c.slug = 'video-cais-sodre-ultima-decada';


-- 28. VIDEO — Vídeo: dentro da nova estação de metro
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'VIDEO',
    'Vídeo: dentro da nova estação de metro',
    'Uma visita guiada às obras, aos acessos e aos desafios de mobilidade.',
    (SELECT id FROM medias WHERE object_key = 'seed/002.mp4'),
    'video-nova-estacao-metro',
    (SELECT id FROM categories WHERE slug = 'sociedade'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-22 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Uma visita guiada às obras, aos acessos e aos desafios de mobilidade. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 4 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O vídeo acompanha o tema no terreno e reúne imagens, contexto e entrevistas breves com protagonistas da história.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'pedro.martins'
WHERE c.slug = 'video-nova-estacao-metro'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'mobilidade' WHERE c.slug = 'video-nova-estacao-metro'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'transportes' WHERE c.slug = 'video-nova-estacao-metro'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'video-nova-estacao-metro';


-- 29. VIDEO — Vídeo: uma tarde numa redação local
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'VIDEO',
    'Vídeo: uma tarde numa redação local',
    'Como se escolhem temas, imagens e títulos antes de uma edição fechar.',
    (SELECT id FROM medias WHERE object_key = 'seed/002.mp4'),
    'video-tarde-redacao-local',
    (SELECT id FROM categories WHERE slug = 'media'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-26 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Como se escolhem temas, imagens e títulos antes de uma edição fechar. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 4 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O vídeo acompanha o tema no terreno e reúne imagens, contexto e entrevistas breves com protagonistas da história.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'rita.ferreira'
WHERE c.slug = 'video-tarde-redacao-local'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'media' WHERE c.slug = 'video-tarde-redacao-local'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'reportagem' WHERE c.slug = 'video-tarde-redacao-local';


-- 30. VIDEO — Vídeo: o percurso das bicicletas partilhadas
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'VIDEO',
    'Vídeo: o percurso das bicicletas partilhadas',
    'Seguimos uma bicicleta durante um dia para perceber usos e problemas.',
    (SELECT id FROM medias WHERE object_key = 'seed/001.mp4'),
    'video-bicicletas-partilhadas-lisboa',
    (SELECT id FROM categories WHERE slug = 'a-fundo'),
    (EXTRACT(EPOCH FROM (NOW() + INTERVAL '-35 days'))::bigint),
    'APPROVED'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Seguimos uma bicicleta durante um dia para perceber usos e problemas. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 4 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O vídeo acompanha o tema no terreno e reúne imagens, contexto e entrevistas breves com protagonistas da história.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'ines.matos'
WHERE c.slug = 'video-bicicletas-partilhadas-lisboa'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'mobilidade' WHERE c.slug = 'video-bicicletas-partilhadas-lisboa'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'ambiente' WHERE c.slug = 'video-bicicletas-partilhadas-lisboa'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'video-bicicletas-partilhadas-lisboa';


-- 31. VIDEO — Reportagem: 24 horas no mercado
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'VIDEO',
    'Reportagem: 24 horas no mercado',
    'Um dia inteiro na vida do Mercado da Ribeira.',
    (SELECT id FROM medias WHERE object_key = 'seed/001.mp4'),
    'reportagem-24h-no-mercado-v2',
    (SELECT id FROM categories WHERE slug = 'sociedade'),
    NULL,
    'PENDING_REVIEW'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Um dia inteiro na vida do Mercado da Ribeira. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 4 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O vídeo acompanha o tema no terreno e reúne imagens, contexto e entrevistas breves com protagonistas da história.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'miguel.lopes'
WHERE c.slug = 'reportagem-24h-no-mercado-v2'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'reportagem' WHERE c.slug = 'reportagem-24h-no-mercado-v2'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'comercio-local' WHERE c.slug = 'reportagem-24h-no-mercado-v2';


-- 32. ARTICLE — Rascunho: a próxima grande reportagem urbana
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Rascunho: a próxima grande reportagem urbana',
    'Notas de investigação sobre transportes, habitação e desigualdade territorial.',
    NULL,
    'rascunho-proxima-grande-reportagem-urbana',
    (SELECT id FROM categories WHERE slug = 'a-fundo'),
    NULL,
    'DRAFT'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Notas de investigação sobre transportes, habitação e desigualdade territorial. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 4 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 5 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'sofia.almeida'
WHERE c.slug = 'rascunho-proxima-grande-reportagem-urbana'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'investigacao' WHERE c.slug = 'rascunho-proxima-grande-reportagem-urbana'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'urbanismo' WHERE c.slug = 'rascunho-proxima-grande-reportagem-urbana';


-- 33. ARTICLE — Rascunho: roteiro de cinema ao ar livre
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Rascunho: roteiro de cinema ao ar livre',
    'Ideias para um guia cultural de verão.',
    NULL,
    'rascunho-roteiro-cinema-ar-livre',
    (SELECT id FROM categories WHERE slug = 'cultura'),
    NULL,
    'DRAFT'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Ideias para um guia cultural de verão. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 4 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 5 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'duarte.neves'
WHERE c.slug = 'rascunho-roteiro-cinema-ar-livre'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'cinema' WHERE c.slug = 'rascunho-roteiro-cinema-ar-livre'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'cultura' WHERE c.slug = 'rascunho-roteiro-cinema-ar-livre';


-- 34. ARTICLE — Em revisão: novas regras para esplanadas
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Em revisão: novas regras para esplanadas',
    'A proposta municipal tenta equilibrar comércio, ruído e circulação pedonal.',
    (SELECT id FROM medias WHERE object_key = 'seed/003.jpg'),
    'em-revisao-novas-regras-esplanadas',
    (SELECT id FROM categories WHERE slug = 'politica'),
    NULL,
    'PENDING_REVIEW'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'A proposta municipal tenta equilibrar comércio, ruído e circulação pedonal. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/007.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'tiago.costa'
WHERE c.slug = 'em-revisao-novas-regras-esplanadas'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'politica' WHERE c.slug = 'em-revisao-novas-regras-esplanadas'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'comercio-local' WHERE c.slug = 'em-revisao-novas-regras-esplanadas'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'lisboa' WHERE c.slug = 'em-revisao-novas-regras-esplanadas';


-- 35. ARTICLE — Em revisão: escolas testam horários flexíveis
WITH new_content AS (
INSERT INTO contents (type, title, headline, featured_media_id, slug, category_id, published_at, state)
VALUES (
    'ARTICLE',
    'Em revisão: escolas testam horários flexíveis',
    'Diretores dizem que a medida ajuda famílias, mas exige mais recursos.',
    (SELECT id FROM medias WHERE object_key = 'seed/004.jpg'),
    'em-revisao-escolas-horarios-flexiveis',
    (SELECT id FROM categories WHERE slug = 'educacao'),
    NULL,
    'PENDING_REVIEW'
    )
    RETURNING id
    )
INSERT INTO content_blocks (content_id, type, content, media_id, position)
SELECT id, 'TEXT'::block_type, 'Diretores dizem que a medida ajuda famílias, mas exige mais recursos. A reportagem acompanha fontes locais, documentos públicos e testemunhos recolhidos ao longo das últimas semanas.', NULL::integer, 1 FROM new_content
UNION ALL
SELECT id, 'H3'::block_type, 'O que está em causa', NULL::integer, 2 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'O tema ganhou destaque porque cruza decisões públicas, vida quotidiana e o futuro da cidade. Para moradores e especialistas, a resposta deve combinar planeamento, transparência e continuidade.', NULL::integer, 3 FROM new_content
UNION ALL
SELECT id, 'MEDIA'::block_type, NULL::text, (SELECT id FROM medias WHERE object_key = 'seed/008.jpg'), 4 FROM new_content
UNION ALL
SELECT id, 'QUOTE'::block_type, 'A cidade muda depressa, mas precisa de continuar habitável para quem a constrói todos os dias.', NULL::integer, 5 FROM new_content
UNION ALL
SELECT id, 'TEXT'::block_type, 'Nos próximos meses, novas decisões devem clarificar o rumo do processo. Até lá, associações, técnicos e responsáveis políticos prometem manter o tema na agenda pública.', NULL::integer, 6 FROM new_content;

INSERT INTO content_authors (content_id, author_id, role)
SELECT c.id, u.id, 'primary'
FROM contents c
         JOIN users u ON u.username = 'ana.silva'
WHERE c.slug = 'em-revisao-escolas-horarios-flexiveis'
  AND NOT EXISTS (
    SELECT 1 FROM content_authors ca WHERE ca.content_id = c.id AND ca.author_id = u.id
);

INSERT INTO content_tags (content_id, tag_id, role)
SELECT c.id, t.id, 'primary' FROM contents c JOIN tags t ON t.slug = 'educacao' WHERE c.slug = 'em-revisao-escolas-horarios-flexiveis'
UNION ALL
SELECT c.id, t.id, 'secondary' FROM contents c JOIN tags t ON t.slug = 'sociedade' WHERE c.slug = 'em-revisao-escolas-horarios-flexiveis';


-- Featured sections adicionais para preencher homepage.
-- Não remove as seções atuais; apenas garante algumas seções de categoria e vídeos.
INSERT INTO featured_sections (type, category_id, position)
SELECT 'CATEGORY', id, 7 FROM categories WHERE slug = 'sociedade'
                                           AND NOT EXISTS (SELECT 1 FROM featured_sections WHERE position = 7)
UNION ALL
SELECT 'CATEGORY', id, 8 FROM categories WHERE slug = 'cultura'
                                           AND NOT EXISTS (SELECT 1 FROM featured_sections WHERE position = 8)
UNION ALL
SELECT 'CATEGORY', id, 9 FROM categories WHERE slug = 'politica'
                                           AND NOT EXISTS (SELECT 1 FROM featured_sections WHERE position = 9)
UNION ALL
SELECT 'VIDEOS', NULL, 10
    WHERE NOT EXISTS (SELECT 1 FROM featured_sections WHERE position = 10);

-- Conteúdos em destaque, sem duplicar se já existirem.
INSERT INTO featured_contents (section_id, content_id, position)
SELECT fs.id, c.id, 0
FROM featured_sections fs, contents c
WHERE fs.position = 0 AND c.slug = 'video-cais-sodre-ultima-decada';

INSERT INTO featured_contents (section_id, content_id, position)
SELECT fs.id, c.id, 2
FROM featured_sections fs, contents c
WHERE fs.position = 1 AND c.slug = 'transformacao-silenciosa-avenida-almirante-reis';

INSERT INTO featured_contents (section_id, content_id, position)
SELECT fs.id, c.id, 0
FROM featured_sections fs, contents c
WHERE fs.position = 7 AND c.slug = 'lisboa-prepara-ondas-calor';

INSERT INTO featured_contents (section_id, content_id, position)
SELECT fs.id, c.id, 0
FROM featured_sections fs, contents c
WHERE fs.position = 8 AND c.slug = 'museu-exposicao-lisboa-oitocentista';

INSERT INTO featured_contents (section_id, content_id, position)
SELECT fs.id, c.id, 0
FROM featured_sections fs, contents c
WHERE fs.position = 9 AND c.slug = 'parlamento-consensos-linhas-vermelhas';

INSERT INTO featured_contents (section_id, content_id, position)
SELECT fs.id, c.id, 0
FROM featured_sections fs, contents c
WHERE fs.position = 10 AND c.slug = 'video-nova-estacao-metro';

INSERT INTO featured_contents (section_id, content_id, position)
SELECT fs.id, c.id, 1
FROM featured_sections fs, contents c
WHERE fs.position = 10 AND c.slug = 'video-tarde-redacao-local';

-- Créditos de media adicionais'
INSERT INTO media_credits (media_id, user_id, role)
SELECT m.id, u.id, 'PHOTOGRAPHER'::credit_role
FROM medias m
         JOIN users u ON u.username = 'sofia.almeida'
WHERE m.object_key IN ('seed/007.jpg','seed/008.jpg','seed/009.jpg','seed/010.jpg');

-- Site settings (social links, contact info, header navigation config)
INSERT INTO settings (key, value) VALUES
    ('social.facebook',        'https://facebook.com/diariolx'),
    ('social.twitter',         'https://twitter.com/diariolx'),
    ('social.instagram',       'https://instagram.com/diariolx'),
    ('contact.email',          'diariolx@escs.ipl.pt'),
    ('contact.address',        'Campus de Benfica - Edifício Escola Superior de Comunicação Social, LIACOM - piso 1 549-014, Lisboa'),
    ('publication.erc',         '128219'),
    ('publication.periodicity', 'Diário'),
    ('publication.owner',       'Escola Superior de Comunicação Social (ESCS) - Instituto Politécnico de Lisboa'),
    ('publication.nipc',        '508 519 713'),
    ('nav.showPhotos',         'true'),
    ('nav.showPodcasts',       'true'),
    ('nav.showVideos',         'true');

INSERT INTO navigation_featured_categories (category_id, position) VALUES
    ((SELECT id FROM categories WHERE slug = 'lisboa-cidade-aberta'), 0),
    ((SELECT id FROM categories WHERE slug = 'a-fundo'), 1);

UPDATE users SET on_team = TRUE,
    position = 'Diretora e editora da Secção Lisboa, Cidade Aberta',
    bio = 'Jornalista desde 1997, já trabalhou, colaborou ou publicou em diversos meios de comunicação nacionais. Doutorada em Ciências da Comunicação pela Faculdade de Ciências Sociais e Humanas (FCSH) da Universidade Nova de Lisboa, é coordenadora da licenciatura em Jornalismo da Escola Superior de Comunicação Social (ESCS) e do Laboratório de Tendências em Jornalismo, do LIACOM.'
WHERE username = 'rita.ferreira';

UPDATE users SET on_team = TRUE,
    position = 'Editora de Infografia',
    bio = 'É licenciada em Ciências da Comunicação, pela FCSH - Universidade Nova, bem como em Design, pela Faculdade de Arquitetura da Universidade de Lisboa. Concluiu um doutoramento na FCSH-Universidade Nova, na área da visualização de informação.'
WHERE username = 'sofia.almeida';

UPDATE users SET on_team = TRUE,
    position = 'Repórter de cidade',
    bio = 'Repórter dedicado à cobertura da vida urbana de Lisboa, com especial interesse em mobilidade, habitação e comunidades locais.'
WHERE username = 'pedro.martins';

UPDATE users SET on_team = TRUE,
    position = 'Jornalista',
    bio = 'Colabora com o DiárioLX na cobertura de sociedade e cultura, com foco em histórias de proximidade.'
WHERE username = 'ines.matos';

-- CategoryRow: a row of 4 articles, each column headed by the article's own category.
INSERT INTO featured_sections (type, category_id, position)
SELECT 'CATEGORY_ROW', NULL, 11
WHERE NOT EXISTS (SELECT 1 FROM featured_sections WHERE position = 11);

INSERT INTO featured_contents (section_id, content_id, position)
SELECT fs.id, picked.id, picked.rn - 1
FROM featured_sections fs
         JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM contents
    WHERE type = 'ARTICLE' AND state = 'APPROVED' AND slug IS NOT NULL AND category_id IS NOT NULL
    ORDER BY id
    LIMIT 4
) picked ON TRUE
WHERE fs.position = 11
  AND NOT EXISTS (SELECT 1 FROM featured_contents fc WHERE fc.section_id = fs.id);
