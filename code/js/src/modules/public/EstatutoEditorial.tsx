const PARAGRAPHS: string[] = [
    'é um projeto multiplataforma e transmedia que pretende identificar e utilizar linguagens ou tecnologias inovadoras para transmitir informação, mas preservando os princípios do jornalismo rigoroso, pluralista e imparcial. Procura seguir as melhores tendências do jornalismo internacional.',
    'é uma estrutura do Laboratório de Tendências no Jornalismo, do LIACOM (Laboratório de Investigação Aplicada em Comunicação), propriedade da Escola Superior de Comunicação Social (ESCS)-Instituto Politécnico de Lisboa (IPL), pelo que também assume uma vertente científica. Como objeto de estudo, será sujeito ao acompanhamento constante de uma equipa de investigadores na área dos estudos dos Media e do Jornalismo, a fim de rastrear as rotinas de produção, opções editoriais, recursos tecnológicos e estudar a receção do público aos diferentes géneros, formatos, linguagens e temas, contribuindo para o conhecimento do jornalismo credível e que consegue fidelizar públicos.',
    'é um jornal multiplataforma composto por uma redação semiprofissional. Nasce do encontro geracional e do cruzamento de experiências entre um grupo de jornalistas profissionais, que assume a coordenação, e os estudantes da licenciatura e mestrado em Jornalismo da ESCS, ainda em formação. Permite pôr em prática aprendizagens e estimular o pensamento crítico nos jornalistas do futuro, ao mesmo tempo que mapeia as novas tendências profissionais.',
    'segue escrupulosamente o Código Deontológico. Privilegia a publicação de temáticas de interesse público e que zelem pelo bem-comum. Compromete-se com a verdade dos factos: não especula, não alimenta rumores, não mistura informação com opinião, rejeita qualquer tipo de sensacionalismo.',
    'tem como princípios sagrados a transparência, a liberdade e a independência editorial. Em nenhuma circunstância o jornal cederá a pressões institucionais, políticas, económicas ou ideológicas, favorecimentos ou qualquer tipo de enviesamento do que é o jornalismo.',
    'aposta no jornalismo de profundidade. Rejeita a aceleração e a superficialidade, mesmo que, por vezes, tenha de se afastar da novidade e da atualidade. Na abordagem aos assuntos eminentes e problemáticos, procura, com recurso a informação e vozes especializadas, responder ao porquê e encontrar soluções para determinadas realidades. O compromisso com a imparcialidade, neutralidade e a "conduta de objetividade", tal como definiu Mário Mesquita, necessária ao exercício jornalístico não dispensa a presença de ângulos de abordagem originais e que, realmente, possam acrescentar valor à informação partilhada.',
    'será uma janela aberta para os acontecimentos em diferentes áreas editoriais, histórias e temas da região da Grande Lisboa, do país e do mundo. Tem uma forte preocupação cívica, humanista e, em nenhuma circunstância, permitirá que o bom jornalismo que pratica possa ser indissociável de valores como a igualdade, a justiça e a democracia, contribuindo para valorizar as pessoas e a sua qualidade de vida.',
    'pretende chegar aos mais jovens. Além da narrativa escrita, aposta no jornalismo visual, como a fotografia, a infografia e o vídeo, além de novos formatos sonoros. Propõe-se a apostar no tratamento jornalístico de temáticas e de histórias que vão ao encontro das necessidades informativas das novas gerações, sem descurar a memória e os mais antigos.',
    'pretende ser um contributo importante para o aumento da literacia mediática e para a formação da opinião pública, bem como um impulso relevante na consolidação de uma sociedade menos vulnerável à desinformação e à manipulação ideológica; mais apta a tomar decisões informadas e conscientes.',
];

export function EstatutoEditorial() {
    return (
        <div className='container py-5'>
            <div className='mx-auto' style={{ maxWidth: 820 }}>
                <h1 className='fw-bold border-bottom border-2 border-dark pb-2 mb-5'>Estatuto Editorial</h1>
                {PARAGRAPHS.map((text, index) => (
                    <p
                        key={index}
                        className='mb-4'
                        style={{
                            fontFamily: '"Source Serif 4", Georgia, serif',
                            fontSize: '1.1rem',
                            lineHeight: 1.7,
                        }}
                    >
                        <strong>Diário LX</strong> {text}
                    </p>
                ))}
            </div>
        </div>
    );
}
