import React from 'react';

import { HeroArticle } from './HeroArticle';
import { FeaturedGrid } from './FeatureGrid';
import { Latest } from './Latest'
import { LisboaCidadeAbertaSection } from './LisboaCidadeAbertaSection';
import { CategoryRow } from './Category'
import { AFundoSection } from './AFundoSection';
import { ThreeColSection } from './ThreeColSection';
import { TeamSection } from './TeamSection';

import './Home.css'

export interface Article {
    id: string;
    category: string;
    title: string;
    excerpt?: string;
    imageUrl: string;
    imageAlt?: string;
    date?: string;
    readTime?: string;
    href?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
}

const placeholder = (w: number, h: number, seed: number) =>
    `https://picsum.photos/seed/${seed}/${w}/${h}`;

const mkArticle = (
    id: string,
    category: string,
    title: string,
    excerpt: string,
    seed: number,
    readTime = '4 min',
): Article => ({
    id,
    category,
    title,
    excerpt,
    imageUrl: placeholder(640, 420, seed),
    imageAlt: title,
    readTime,
    href: '#',
});

const HERO: Article = mkArticle(
    'hero',
    'Jovens',
    'Jovens artistas à procura de oportunidades: país dos sonhos e das ilusões',
    'Tal é o país atual que Gonçalo, Inês, Mariana e Sebastião encontraram às suas portas. Pode ser difícil encontrar-se e sustentar-se e às vezes é preciso ultrapassar falta de interesse nacional.',
    10,
    '8 min'
);

const FEATURED: Article[] = [
    mkArticle('f1', 'Desporto', 'A luta do futebol feminino além das quatro linhas', '', 20, '5 min'),
    mkArticle('f2', '50 Anos', '50 anos de Abril: Como revigorar a democracia?', '', 30, '6 min'),
    mkArticle('f3', 'Crónica', 'David comprou a casa de sonho por 360 mil euros. Pode ser engolida pelo mar em menos de dez anos', '', 40, '7 min'),
];

const ULTIMAS: Article[] = [
    mkArticle('u1', 'Opinião', 'Fernanda Fragateiro muda o rumo do Circo Corricò – Espaço de Pilates numa drama universal', '', 50, '3 min'),
    mkArticle('u2', 'Internacional', 'O dado passa não-stop: fim-de-semana com notícias tropicais e temporais no século XXI', '', 60, '4 min'),
    mkArticle('u3', 'Moda', 'Depois a seguir à Portuguesa: Ciganos distinguem-lhe da Moda de Inovação nos Média', '', 70, '5 min'),
    mkArticle('u4', 'Política', 'Cerca de 1300 pessoas exigem que políticos tomem medidas para travar ódio contra animais', '', 80, '4 min'),
    mkArticle('u5', 'Cidade', 'Das ruas para o restaurante: a associação que transforma vidas', '', 90, '6 min'),
];

const LISBOA_ARTICLES: Article[] = [
    mkArticle('l1', 'Lisboa', 'Das ruas para o restaurante: a associação que transforma vidas', '', 91),
    mkArticle('l2', 'Lisboa', 'Santa Casa da Misericórdia de Lisboa. Trabalhadores reagem a plano de reestruturação', '', 92),
    mkArticle('l3', 'Lisboa', 'Maçonaria de portas abertas: uma sombra ruidosa', '', 93),
    mkArticle('l4', 'Lisboa', 'Maçonaria de portas abertas: uma sombra ruidosa', '', 93),
];

const CATEGORIES = [
    { title: 'Internacional', href: '#', article: mkArticle('ci1', 'Internacional', 'A ciência de como reconhecemos a cara dos outros: sai um milímetro de diferença', '', 101, '3 min') },
    { title: 'Política', href: '#', article: mkArticle('cp1', 'Política', 'Portugal regista em 2025 percentagem mais alta da UE em cumprir plano de ação', '', 102, '4 min') },
    { title: 'Sociedade', href: '#', article: mkArticle('cs1', 'Inovação', 'Em Quinzenas, instala uma caso com um reforço em cada lar português', '', 103, '3 min') },
    { title: 'Economia', href: '#', article: mkArticle('ce1', 'Futsal', 'A luta do futebol feminino além das quatro linhas', '', 104, '4 min') },
];

const AFUNDO: Article[] = [
    mkArticle('af1', 'Reportagem', 'A origem da "nostalgia" que põe a "rockar" diferentes gerações', 'Artigo de fundo sobre tendências culturais que transcendem o tempo e ligam gerações.', 111, '10 min'),
    mkArticle('af2', 'Crónica', 'Das ruas para o restaurante: a associação que transforma vidas', '', 112, '7 min'),
    mkArticle('af3', 'Especial', '50 anos de Abril: Como revigorar a democracia?', '', 113, '9 min'),
    mkArticle('af4', 'Maçonaria', 'Maçonaria de portas abertas: uma sombra ruidosa', '', 114, '6 min'),
    mkArticle('af5', 'Jovens', 'Jovens artistas à procura de oportunidades: país dos sonhos e das ilusões', '', 115, '8 min'),
];

const ESPECIAIS: Article[] = [
    mkArticle('e1', 'Cultura', 'A origem da "nostalgia" que põe a "rockar" diferentes gerações', '', 121),
    mkArticle('e2', 'Ciência', 'As imagens da Super Lua Azul pelo mundo. Fenómeno também se pode ver em Portugal', '', 122),
    mkArticle('e3', 'Madeira', 'Aviões Canadair já chegaram à Região Autónoma da Madeira', '', 123),
];

const FOTOGRAFIA: Article[] = [
    mkArticle('fo1', 'Fotografia', 'Explorando a história afro-mexicana', '', 131),
    mkArticle('fo2', 'Memória', 'Diana Dionísio explora a memória colonial a partir das suas arquivos familiar', '', 132),
    mkArticle('fo3', 'Mar', 'Fotógrafo nantarra traz o retrato da morte lenta do Mar Cáspio', '', 133),
];

const PODCASTS: Article[] = [
    mkArticle('po1', 'Podcast', 'Opiniões de Chora', '', 141),
    mkArticle('po2', 'Podcast', 'Vida quotidiana em Istambul', '', 142),
    mkArticle('po3', 'Podcast', 'Nesta altura com que pinte que temos do lado certo da verde', '', 143),
];

const VIDEOS: Article[] = [
    mkArticle('vi1', 'Vídeo', 'A luta do futebol feminino', '', 151),
    mkArticle('vi2', 'Vídeo', 'Caminhada mundial de liberdade de Santarém', '', 152),
    mkArticle('vi3', 'Vídeo', 'Campeonato mundial de Jiu-Jitsu. David André', '', 153),
];

const TEAM: TeamMember[] = [
    { id: 't1', name: 'Ana Ramos', role: 'Jornalista', imageUrl: placeholder(200, 200, 200) },
    { id: 't2', name: 'Joana Amaral', role: 'Colaboradora', imageUrl: placeholder(200, 200, 201) },
    { id: 't3', name: 'Gonçalo Ribeiro', role: 'Colaborador', imageUrl: placeholder(200, 200, 202) },
    { id: 't4', name: 'Ricardo Valeiro', role: 'Jornalista', imageUrl: placeholder(200, 200, 203) },
];

export interface HomePageProps {
    heroArticle?: Article;
    featuredArticles?: Article[];
    ultimasArticles?: Article[];
    lisboaArticles?: Article[];
    categoryArticles?: typeof CATEGORIES;
    afundoArticles?: Article[];
    especiaisArticles?: Article[];
    fotografiaArticles?: Article[];
    podcastsArticles?: Article[];
    videosArticles?: Article[];
    teamMembers?: TeamMember[];
}

export const Home: React.FC<HomePageProps> = ({
    heroArticle = HERO,
    featuredArticles = FEATURED,
    ultimasArticles = ULTIMAS,
    lisboaArticles = LISBOA_ARTICLES,
    categoryArticles = CATEGORIES,
    afundoArticles = AFUNDO,
    especiaisArticles = ESPECIAIS,
    fotografiaArticles = FOTOGRAFIA,
    podcastsArticles = PODCASTS,
    videosArticles = VIDEOS,
    teamMembers = TEAM,
}) => (
    <>
        <HeroArticle article={heroArticle} />
        <FeaturedGrid articles={featuredArticles} />
        <Latest articles={ultimasArticles} />
        <LisboaCidadeAbertaSection
            categoryImageUrl={placeholder(1400, 420, 99)}
            articles={lisboaArticles}
        />
        <CategoryRow categories={categoryArticles} />
        <AFundoSection articles={afundoArticles} />
        <ThreeColSection
            title='Especiais'
            articles={especiaisArticles}
            href='#'
        />
        <ThreeColSection
            title='Fotografia'
            articles={fotografiaArticles}
            href='#'
        />
        <ThreeColSection
            title='Podcasts'
            articles={podcastsArticles}
            href='#'
            showPlayIcon
        />
        <ThreeColSection
            title='Vídeos'
            articles={videosArticles}
            href='#'
            showPlayIcon
        />
        <TeamSection members={teamMembers} />
    </>
);
