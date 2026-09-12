import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, topico, textoUsuario, contextoEtapa, perguntaUsuario } = body;

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Se a chave não estiver configurada no .env.local, retorna resposta inteligente pedagógica simulada
    if (!apiKey) {
      if (tipo === "explain_feedback") {
        const texto = (textoUsuario || "").toLowerCase();
        const temLinear = texto.includes("linear") || texto.includes("fix") || texto.includes("bandeirada") || texto.includes("b");
        const temAngular = texto.includes("angular") || texto.includes("km") || texto.includes("vari") || texto.includes("inclin") || texto.includes("a");
        const temIntersecao = texto.includes("igual") || texto.includes("intersec") || texto.includes("cruza") || texto.includes("empate");

        let nota = 50;
        const pontosPositivos: string[] = [];
        const lacunas: string[] = [];

        if (temLinear) {
          nota += 20;
          pontosPositivos.push("Você identificou com precisão a taxa fixa (coeficiente linear b) como o ponto de partida do custo.");
        } else {
          lacunas.push("Faltou destacar claramente o papel do coeficiente linear (b) como o valor inicial quando a distância é zero.");
        }

        if (temAngular) {
          nota += 20;
          pontosPositivos.push("Excelente percepção sobre a taxa de variação (coeficiente angular a) representando o custo por quilômetro.");
        } else {
          lacunas.push("Explique melhor como o coeficiente angular (a) dita a rapidez com que o preço sobe a cada quilômetro.");
        }

        if (temIntersecao) {
          nota += 10;
          pontosPositivos.push("Ótima análise do ponto de cruzamento entre as duas retas (onde os preços se igualam).");
        } else {
          lacunas.push("Para gabaritar no Enem: mencione o ponto de igualdade entre as opções para saber quando uma compensa mais que a outra.");
        }

        return NextResponse.json({
          mock: true,
          notaDominio: Math.min(100, nota),
          pontosPositivos: pontosPositivos.length > 0 ? pontosPositivos : ["Boa tentativa de articular o problema com suas próprias palavras!"],
          lacunas: lacunas.length > 0 ? lacunas : ["Sua explicação cobriu todos os conceitos essenciais do ENEM!"],
          dicaPedagogica:
            "Parabéns pelo esforço de auto-explicação! Conectar a teoria matemática a corridas de aplicativo é exatamente o tipo de competência prática (Habilidade 21) que o Inep cobra.",
        });
      }

      if (tipo === "tira_duvidas") {
        return NextResponse.json({
          mock: true,
          resposta: `Excelente pergunta sobre **${topico || "Funções do 1º Grau"}**!\n\nNa prova do ENEM, o segredo dessa matéria é lembrar que toda reta segue a lei **f(x) = ax + b**. Sempre que a questão falar de "taxa fixa", ela está te dando o **b** (onde a reta corta o eixo vertical). Quando falar de "valor por quilômetro" ou "por hora", ela está te dando o **a** (a inclinação).\n\nQuer que eu monte um exemplo numérico passo a passo para você fixar?`,
        });
      }

      if (tipo === "corrigir_redacao") {
        return NextResponse.json({
          mock: true,
          notaC1: 160,
          notaC2: 180,
          notaC3: 160,
          notaC4: 180,
          notaC5: 160,
          notaTotal: 840,
          feedback: {
            c1: "bom domínio da norma culta com pontuação adequada na introdução.",
            c2: "tema compreendido com repertório sociocultural legitimado e produtivo.",
            c3: "projeto de texto consistente, aprofundando a relação causa-efeito.",
            c4: "boa diversidade de operadores argumentativos interparágrafos.",
            c5: "proposta de intervenção completa com agente, ação, meio e detalhamento.",
          },
        });
      }

      return NextResponse.json({
        mock: true,
        resposta: "Requisição processada em modo pedagógico de demonstração.",
      });
    }

    // Inicialização do SDK oficial do Google GenAI com a chave segura de backend
    const ai = new GoogleGenAI({ apiKey });

    // Helper para gerar conteúdo com fallback automático entre modelos
    const generateWithFallback = async (prompt: string, jsonMode: boolean = false) => {
      try {
        return await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: jsonMode ? { responseMimeType: "application/json" } : undefined,
        });
      } catch (err) {
        return await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
          config: jsonMode ? { responseMimeType: "application/json" } : undefined,
        });
      }
    };

    if (tipo === "explain_feedback") {
      const prompt = `Você é a IA Tutora Pedagógica da plataforma "Trilha 1000", especialista em avaliação pelo método de Feynman e no ENEM.
O aluno acabou de estudar "${topico || "Função Afim f(x) = ax + b"}" e tentou explicar o conceito com suas próprias palavras.

Contexto da etapa: ${contextoEtapa || "Funções do 1º Grau, coeficientes a e b, gráficos e situações cotidianas"}.
Texto digitado pelo aluno: "${textoUsuario}".

Avalie a resposta com base em rigor conceitual e clareza. Retorne EXCLUSIVAMENTE um objeto JSON no formato:
{
  "notaDominio": number (de 0 a 100),
  "pontosPositivos": [string, string],
  "lacunas": [string, string],
  "dicaPedagogica": string
}`;

      const response = await generateWithFallback(prompt, true);
      const parsed = JSON.parse(response.text || "{}");
      return NextResponse.json(parsed);
    }

    if (tipo === "tira_duvidas") {
      const prompt = `Você é a IA Tutora da plataforma "Trilha 1000". Seu tom é de parceiro de treino, estimulante, empático e focado no modelo de prova do ENEM.
O aluno está na etapa: "${topico}".
Contexto: ${contextoEtapa}.
Dúvida do aluno: "${perguntaUsuario}".

Responda de forma clara, didática, em no máximo 3 parágrafos curtos, usando analogias simples e destacando como o ENEM cobra esse conceito.`;

      const response = await generateWithFallback(prompt, false);
      return NextResponse.json({
        resposta: response.text,
      });
    }

    if (tipo === "corrigir_redacao") {
      const { tema, textoRedacao } = body;
      const prompt = `Você é um corretor oficial da banca de redação do ENEM da plataforma Trilha 1000.
Tema da proposta: "${tema}".
Texto da redação do candidato:
"""
${textoRedacao}
"""

Avalie a redação rigorosamente com base nas 5 competências oficiais do ENEM (C1 a C5, cada uma variando de 0 a 200 em múltiplos de 40: 0, 40, 80, 120, 160, 200).
Retorne EXCLUSIVAMENTE um objeto JSON no formato:
{
  "notaC1": number,
  "notaC2": number,
  "notaC3": number,
  "notaC4": number,
  "notaC5": number,
  "notaTotal": number,
  "feedback": {
    "c1": string,
    "c2": string,
    "c3": string,
    "c4": string,
    "c5": string
  }
}`;

      const response = await generateWithFallback(prompt, true);
      const parsed = JSON.parse(response.text || "{}");
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: "Tipo de requisição inválido" }, { status: 400 });
  } catch (error: any) {
    console.error("Erro na API do Tutor:", error);
    return NextResponse.json(
      { error: "Falha ao processar tutoria de IA", details: error.message },
      { status: 500 }
    );
  }
}
