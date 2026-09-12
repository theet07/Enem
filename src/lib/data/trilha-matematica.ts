/**
 * Dados Pedagógicos Estruturados — Trilha de Matemática (ENEM)
 * Base de dados curada com foco no Ciclo ATIVO completo de Funções do 1º Grau (Afim).
 */

export interface QuestaoAlternativa {
  letra: "A" | "B" | "C" | "D" | "E";
  texto: string;
  ehCorreta: boolean;
  explicacao: string;
}

export interface QuestaoEnem {
  id: string;
  etapaId: string;
  tipo: "ativacao" | "verificacao" | "simulado";
  enunciado: string;
  contexto?: string;
  imagemUrl?: string;
  habilidadeInep: string;
  anoEnem?: number;
  dificuldadeCalibrada: number; // Escala TRI (300 a 900)
  alternativas: QuestaoAlternativa[];
}

export interface TopicoTrilha {
  id: string;
  nome: string;
  slug: string;
  faseTemporada: "fundacao" | "consolidacao" | "intensivo" | "reta_final";
  ordem: number;
  preRequisitoId?: string;
  preRequisitoNome?: string;
  pesoEnem: number;
  descricao: string;
  icone: string;
  ipEstimado: number;
  status: "bloqueado" | "disponivel" | "em_progresso" | "dominado";
  porcentagemDominio: number;
}

export interface EtapaConteudo {
  id: string;
  topicoSlug: string;
  titulo: string;
  subtitulo: string;
  videoUrl: string;
  youtubeId: string;
  videoCanal: string;
  videoDuracaoMin: number;
  resumoVisual: {
    formulaPrincipal: string;
    itensChave: { titulo: string; descricao: string; destaque: string }[];
    dicaOuroEnem: string;
  };
  mapaMental: {
    conceitoCentral: string;
    nos: {
      titulo: string;
      cor: string;
      subitens: string[];
    }[];
  };
  feynmanPrompt: {
    pergunta: string;
    dicaOrientadora: string;
    conceitosObrigatorios: string[];
  };
  questoesAtivacao: QuestaoEnem[];
  questoesVerificacao: QuestaoEnem[];
}

export const TOPICOS_MATEMATICA: TopicoTrilha[] = [
  {
    id: "top-mat-01",
    nome: "Conjuntos e Intervalos Numéricos",
    slug: "conjuntos-intervalos",
    faseTemporada: "fundacao",
    ordem: 1,
    pesoEnem: 1.1,
    descricao: "União, intersecção, diagramas de Venn e intervalos reais aplicados a problemas do cotidiano.",
    icone: "Layers",
    ipEstimado: 0,
    status: "disponivel",
    porcentagemDominio: 0,
  },
  {
    id: "top-mat-02",
    nome: "Funções do 1º Grau (Afim e Linear)",
    slug: "funcoes-1-grau",
    faseTemporada: "fundacao",
    ordem: 2,
    preRequisitoId: "top-mat-01",
    preRequisitoNome: "Conjuntos e Intervalos Numéricos",
    pesoEnem: 1.5,
    descricao: "Taxa de variação constante, coeficientes angular e linear, gráficos de retas e modelagem de custo/receita.",
    icone: "TrendingUp",
    ipEstimado: 0,
    status: "disponivel",
    porcentagemDominio: 0,
  },
  {
    id: "top-mat-03",
    nome: "Funções do 2º Grau (Quadrática)",
    slug: "funcoes-2-grau",
    faseTemporada: "fundacao",
    ordem: 3,
    preRequisitoId: "top-mat-02",
    preRequisitoNome: "Funções do 1º Grau (≥ 70% de domínio)",
    pesoEnem: 1.4,
    descricao: "Parábolas, vértices (máximos e mínimos de lucro/área), raízes reais e trajetória balística no Enem.",
    icone: "Activity",
    ipEstimado: 0,
    status: "bloqueado",
    porcentagemDominio: 0,
  },
  {
    id: "top-mat-04",
    nome: "Geometria Plana: Áreas e Semelhança",
    slug: "geometria-plana",
    faseTemporada: "consolidacao",
    ordem: 4,
    preRequisitoId: "top-mat-01",
    preRequisitoNome: "Conjuntos e Intervalos Numéricos",
    pesoEnem: 1.7,
    descricao: "Cálculo de áreas compostas, Teorema de Pitágoras, triângulos semelhantes e custo de revestimento.",
    icone: "Square",
    ipEstimado: 0,
    status: "bloqueado",
    porcentagemDominio: 0,
  },
  {
    id: "top-mat-05",
    nome: "Estatística: Média, Mediana e Desvio",
    slug: "estatistica-basica",
    faseTemporada: "consolidacao",
    ordem: 5,
    pesoEnem: 1.8,
    descricao: "Leitura de gráficos complexos, média ponderada, mediana de dados agrupados e desvio padrão como dispersão.",
    icone: "BarChart3",
    ipEstimado: 0,
    status: "bloqueado",
    porcentagemDominio: 0,
  },
  {
    id: "top-mat-06",
    nome: "Trigonometria e Ciclo Trigonométrico",
    slug: "trigonometria",
    faseTemporada: "intensivo",
    ordem: 6,
    preRequisitoId: "top-mat-04",
    preRequisitoNome: "Geometria Plana",
    pesoEnem: 1.2,
    descricao: "Razões trigonométricas no triângulo retângulo, seno, cosseno, ondas periódicas e fenômenos cíclicos.",
    icone: "Compass",
    ipEstimado: 0,
    status: "bloqueado",
    porcentagemDominio: 0,
  },
];

export const ETAPA_FUNCOES_1_GRAU: EtapaConteudo = {
  id: "etapa-f1g-01",
  topicoSlug: "funcoes-1-grau",
  titulo: "Funções do 1º Grau: O Segredo das Retas no ENEM",
  subtitulo: "Domine a taxa de variação constante, os coeficientes angular e linear, e resolva questões de custo e corridas sem errar.",
  videoUrl: "https://www.youtube.com/watch?v=F_f7eYtT0xY",
  youtubeId: "F_f7eYtT0xY",
  videoCanal: "Professor Ferretto",
  videoDuracaoMin: 14,
  resumoVisual: {
    formulaPrincipal: "f(x) = a · x + b",
    itensChave: [
      {
        titulo: "Coeficiente Angular (a) — A Inclinação",
        descricao: "Representa a taxa média de variação da grandeza: a = (y₂ - y₁) / (x₂ - x₁). No ENEM é o valor por km rodado, por hora trabalhada ou por unidade produzida.",
        destaque: "a > 0 (Crescente) | a < 0 (Decrescente) | a = 0 (Constante)",
      },
      {
        titulo: "Coeficiente Linear (b) — O Ponto de Partida",
        descricao: "É o valor da função quando x = 0. No plano cartesiano, é a coordenada exata onde a reta corta o eixo vertical Y: ponto (0, b). No cotidiano, é o valor fixo (bandeirada do táxi, taxa mínima de luz).",
        destaque: "Cruzamento no eixo Y: (0, b)",
      },
      {
        titulo: "Raiz ou Zero da Função — Cruzamento no Eixo X",
        descricao: "É o valor de x que anula a função f(x) = 0. Graficamente, é onde a reta cruza o eixo horizontal X: x = -b / a.",
        destaque: "Ponto (-b/a, 0)",
      },
    ],
    dicaOuroEnem:
      "Quando o ENEM te der um gráfico de reta com dois pontos conhecidos, use sempre a taxa de variação: a = Δy / Δx. Em 90% das questões, você descobre a equação da reta em menos de 40 segundos com essa razão!",
  },
  mapaMental: {
    conceitoCentral: "Função Afim f(x) = ax + b",
    nos: [
      {
        titulo: "Coeficiente Angular (a)",
        cor: "from-blue-500 to-indigo-600",
        subitens: [
          "Taxa de variação: Δy / Δx",
          "Inclinação geométrica: tg(θ)",
          "a > 0: reta sobe (crescente)",
          "a < 0: reta desce (decrescente)",
          "Representa grandezas variáveis (R$/km, L/min)",
        ],
      },
      {
        titulo: "Coeficiente Linear (b)",
        cor: "from-purple-500 to-pink-600",
        subitens: [
          "Interseção no eixo Y: (0, b)",
          "Valor inicial da grandeza (x = 0)",
          "Representa custos fixos (bandeirada, aluguel)",
          "Se b = 0, a função é Linear (origem)",
        ],
      },
      {
        titulo: "Zero da Função (Raiz)",
        cor: "from-emerald-500 to-teal-600",
        subitens: [
          "Solução de ax + b = 0",
          "x = -b / a",
          "Ponto onde a reta corta o eixo X",
          "Ponto de equilíbrio (break-even point)",
        ],
      },
      {
        titulo: "Padrões Clássicos do ENEM",
        cor: "from-amber-500 to-orange-600",
        subitens: [
          "Tarifas de táxi / transporte por aplicativo",
          "Planos de dados de telefonia móvel",
          "Esvaziamento / enchimento linear de reservatórios",
          "Comparação de empresas para saber qual é mais vantajosa",
        ],
      },
    ],
  },
  feynmanPrompt: {
    pergunta:
      "Imagine que você precisa explicar para um colega leigo: por que numa corrida de aplicativo de transporte o valor a pagar nunca começa do zero, e como você usaria os coeficientes 'a' e 'b' da função afim para mostrar quando uma empresa mais cara por quilômetro pode ser mais barata numa viagem curta?",
    dicaOrientadora:
      "Mencione a bandeirada inicial como o coeficiente linear 'b', o valor cobrado por km como o coeficiente angular 'a', e fale sobre o ponto onde as duas opções se igualam.",
    conceitosObrigatorios: [
      "coeficiente linear (b)",
      "coeficiente angular (a)",
      "taxa fixa / bandeirada",
      "taxa variável por km",
      "ponto de interseção / igualdade",
    ],
  },
  questoesAtivacao: [
    {
      id: "atv-01",
      etapaId: "etapa-f1g-01",
      tipo: "ativacao",
      enunciado:
        "Considere o ponto P(0, 7) localizado no plano cartesiano. Esse ponto pertence necessariamente a qual elemento geométrico?",
      habilidadeInep: "Habilidade 19 - Reconhecer representações algébricas e geométricas no plano",
      dificuldadeCalibrada: 420,
      alternativas: [
        {
          letra: "A",
          texto: "Ao eixo das abscissas (eixo X), pois a abscissa é nula.",
          ehCorreta: false,
          explicacao: "Incorreto: se x = 0, o ponto está exatamente em cima do eixo vertical das ordenadas (eixo Y), e não no eixo X.",
        },
        {
          letra: "B",
          texto: "Ao eixo das ordenadas (eixo Y), exatamente na altura y = 7.",
          ehCorreta: true,
          explicacao: "Correto! Todo ponto com abscissa nula (x = 0) intersecta o eixo das ordenadas (eixo Y). Na função afim f(x) = ax + b, este é exatamente o coeficiente linear!",
        },
        {
          letra: "C",
          texto: "Ao primeiro quadrante, pois as coordenadas são positivas.",
          ehCorreta: false,
          explicacao: "Incorreto: pontos sobre os eixos não pertencem a nenhum dos 4 quadrantes.",
        },
        {
          letra: "D",
          texto: "À bissetriz dos quadrantes ímpares.",
          ehCorreta: false,
          explicacao: "Incorreto: a bissetriz dos quadrantes ímpares é a reta y = x, na qual x e y são sempre iguais.",
        },
        {
          letra: "E",
          texto: "À reta horizontal y = 0.",
          ehCorreta: false,
          explicacao: "Incorreto: a reta y = 0 é o próprio eixo das abscissas (eixo X).",
        },
      ],
    },
    {
      id: "atv-02",
      etapaId: "etapa-f1g-01",
      tipo: "ativacao",
      enunciado:
        "Se uma grandeza Y aumenta 15 unidades a cada 3 unidades que a grandeza X aumenta, qual é a taxa média de variação de Y em relação a X?",
      habilidadeInep: "Habilidade 21 - Identificar a taxa de variação de grandezas proporcionais",
      dificuldadeCalibrada: 460,
      alternativas: [
        {
          letra: "A",
          texto: "3 unidades de Y por unidade de X.",
          ehCorreta: false,
          explicacao: "Incorreto: a taxa é ΔY / ΔX = 15 / 3 = 5, não 3.",
        },
        {
          letra: "B",
          texto: "5 unidades de Y por unidade de X.",
          ehCorreta: true,
          explicacao: "Perfeito! A taxa de variação é calculada por a = ΔY / ΔX = 15 / 3 = 5. Esse é o coeficiente angular da reta!",
        },
        {
          letra: "C",
          texto: "45 unidades de Y por unidade de X.",
          ehCorreta: false,
          explicacao: "Incorreto: isso seria o produto 15 × 3, mas taxa é uma divisão.",
        },
        {
          letra: "D",
          texto: "0,2 unidades de Y por unidade de X.",
          ehCorreta: false,
          explicacao: "Incorreto: 0,2 é 3 / 15 (ΔX / ΔY), que inverte a dependência.",
        },
        {
          letra: "E",
          texto: "12 unidades de Y por unidade de X.",
          ehCorreta: false,
          explicacao: "Incorreto: 12 é a subtração 15 - 3, não a razão entre as variações.",
        },
      ],
    },
  ],
  questoesVerificacao: [
    {
      id: "ver-01",
      etapaId: "etapa-f1g-01",
      tipo: "verificacao",
      anoEnem: 2022,
      habilidadeInep: "H19 - Identificar representações algébricas que expressem relação entre grandezas",
      dificuldadeCalibrada: 530,
      enunciado:
        "Uma empresa de entrega expressa cobra seus serviços por meio de uma taxa fixa de postagem de R$ 12,00, acrescida de R$ 2,50 por cada quilômetro percorrido até o endereço de entrega. Qual das seguintes funções matemáticas expressa o custo total C(x), em reais, em função da distância percorrida x, em quilômetros?",
      alternativas: [
        {
          letra: "A",
          texto: "C(x) = 14,50x",
          ehCorreta: false,
          explicacao: "Distrator comum: somou a taxa fixa com a variável sem separar o termo que multiplica x. Na realidade, os R$ 12,00 não dependem dos quilômetros.",
        },
        {
          letra: "B",
          texto: "C(x) = 12x + 2,50",
          ehCorreta: false,
          explicacao: "Distrator de inversão de coeficientes: multiplicou a taxa fixa pela distância e deixou o valor do km como constante.",
        },
        {
          letra: "C",
          texto: "C(x) = 2,50x + 12",
          ehCorreta: true,
          explicacao: "Resposta correta! O custo por quilômetro (R$ 2,50) é a taxa de variação (coeficiente angular 'a'), e a taxa fixa (R$ 12,00) é o coeficiente linear 'b'. Portanto, C(x) = 2,50x + 12.",
        },
        {
          letra: "D",
          texto: "C(x) = 2,50x - 12",
          ehCorreta: false,
          explicacao: "Distrator de sinal: subtraiu a taxa fixa em vez de somar ao custo total.",
        },
        {
          letra: "E",
          texto: "C(x) = (12 + 2,50) / x",
          ehCorreta: false,
          explicacao: "Distrator conceitual: representou uma proporção inversa quando na verdade a relação é linear direta.",
        },
      ],
    },
    {
      id: "ver-02",
      etapaId: "etapa-f1g-01",
      tipo: "verificacao",
      anoEnem: 2021,
      habilidadeInep: "H21 - Resolver problema cuja modelagem envolva conhecimentos algébricos",
      dificuldadeCalibrada: 590,
      enunciado:
        "Um reservatório de água com capacidade de 1.200 litros, inicialmente cheio, começa a ser esvaziado por um ralo a uma vazão constante de 40 litros por minuto. O tempo t, em minutos, necessário para que restem exatamente 200 litros de água no reservatório é de:",
      alternativas: [
        {
          letra: "A",
          texto: "20 minutos",
          ehCorreta: false,
          explicacao: "Distrator: calculou 1200 / (40 + 20) ou dividiu 200 por 40 para obter 5 min e somou 15.",
        },
        {
          letra: "B",
          texto: "25 minutos",
          ehCorreta: true,
          explicacao: "Resposta correta! A função do volume restante é V(t) = 1200 - 40t. Queremos V(t) = 200. Logo: 1200 - 40t = 200 => 40t = 1000 => t = 1000 / 40 = 25 minutos.",
        },
        {
          letra: "C",
          texto: "30 minutos",
          ehCorreta: false,
          explicacao: "Distrator: calculou o tempo total para esvaziar tudo (1200 / 40 = 30 minutos), esquecendo que devem sobrar 200 litros.",
        },
        {
          letra: "D",
          texto: "5 minutos",
          ehCorreta: false,
          explicacao: "Distrator: apenas dividiu os 200 litros restantes pela vazão (200 / 40 = 5).",
        },
        {
          letra: "E",
          texto: "35 minutos",
          ehCorreta: false,
          explicacao: "Distrator: somou o tempo de esvaziamento total (30) com os 5 minutos de 200/40.",
        },
      ],
    },
    {
      id: "ver-03",
      etapaId: "etapa-f1g-01",
      tipo: "verificacao",
      anoEnem: 2023,
      habilidadeInep: "H22 - Utilizar conhecimentos de funções para decidir sobre situações da realidade",
      dificuldadeCalibrada: 670,
      enunciado:
        "Dois serviços de transporte por aplicativo, Alfa e Beta, cobram os seguintes valores:\n• Alfa: R$ 6,00 de taxa fixa + R$ 2,20 por km percorrido.\n• Beta: R$ 10,00 de taxa fixa + R$ 1,80 por km percorrido.\n\nPara qual distância percorrida, em quilômetros, o valor total cobrado pelas duas empresas é rigorosamente idêntico?",
      alternativas: [
        {
          letra: "A",
          texto: "8 km",
          ehCorreta: false,
          explicacao: "Distrator: em 8 km, Alfa cobra 6 + 2,20(8) = R$ 23,60 e Beta cobra 10 + 1,80(8) = R$ 24,40 (diferentes).",
        },
        {
          letra: "B",
          texto: "10 km",
          ehCorreta: true,
          explicacao: "Resposta correta! Igualando as duas funções: 6 + 2,20x = 10 + 1,80x => 2,20x - 1,80x = 10 - 6 => 0,40x = 4 => x = 4 / 0,40 = 10 km. Em 10 km, ambas custam R$ 28,00.",
        },
        {
          letra: "C",
          texto: "12 km",
          ehCorreta: false,
          explicacao: "Distrator de aproximação aritmética incorreta.",
        },
        {
          letra: "D",
          texto: "15 km",
          ehCorreta: false,
          explicacao: "Distrator: calculou 6 / 0,40 = 15.",
        },
        {
          letra: "E",
          texto: "20 km",
          ehCorreta: false,
          explicacao: "Distrator: dobro do valor correto por confusão com 0,20 em vez de 0,40.",
        },
      ],
    },
    {
      id: "ver-04",
      etapaId: "etapa-f1g-01",
      tipo: "verificacao",
      anoEnem: 2020,
      habilidadeInep: "H20 - Interpretar gráfico de reta a partir de dados experimentais",
      dificuldadeCalibrada: 720,
      enunciado:
        "O gráfico de uma função afim f(x) = ax + b passa pelos pontos A(2, 11) e B(5, 23). Com base nessas coordenadas, determine o valor da raiz da função f(x), isto é, o valor de x para o qual f(x) = 0.",
      alternativas: [
        {
          letra: "A",
          texto: "x = -0,75",
          ehCorreta: true,
          explicacao: "Resposta correta! Taxa de variação: a = (23 - 11) / (5 - 2) = 12 / 3 = 4. Usando o ponto A: 11 = 4(2) + b => b = 3. Logo, f(x) = 4x + 3. Para a raiz: 4x + 3 = 0 => 4x = -3 => x = -3/4 = -0,75.",
        },
        {
          letra: "B",
          texto: "x = 0,75",
          ehCorreta: false,
          explicacao: "Distrator de sinal: esqueceu que 4x = -3 resulta em número negativo.",
        },
        {
          letra: "C",
          texto: "x = -1,33",
          ehCorreta: false,
          explicacao: "Distrator de inversão: fez -4/3 em vez de -3/4.",
        },
        {
          letra: "D",
          texto: "x = -3",
          ehCorreta: false,
          explicacao: "Distrator: considerou apenas o coeficiente linear b = 3 com sinal invertido sem dividir por a.",
        },
        {
          letra: "E",
          texto: "x = 4",
          ehCorreta: false,
          explicacao: "Distrator: indicou o coeficiente angular em vez da raiz.",
        },
      ],
    },
  ],
};
