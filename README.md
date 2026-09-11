# 🎯 Trilha 1000 — Plataforma Científica de Estudos para o ENEM

> Plataforma de estudos para o Exame Nacional do Ensino Médio (ENEM) desenhada sobre os princípios da **ciência da aprendizagem** (Retrieval Practice, Efeito de Espaçamento SM-2, Intercalação, Dificuldades Desejáveis, Técnica de Feynman), gamificação de domínio real (**Índice de Proficiência de 0 a 1000 estilo TRI/Elo**), sistema anti-procrastinação (**Modo Fortaleza**) e tutoria inteligente integrada ao **Google Gemini**.

---

## ⚡ Pilares da Plataforma

1. **O Ciclo ATIVO (Unidade de Estudo)**:
   - **A — Ativação (3-5 min)**: Quiz rápido de recuperação ativa de conteúdo pré-requisito antes da matéria nova.
   - **T — Teoria Nova (10-15 min)**: Vídeo curado e focado + Codificação Dual (Resumo Esquematizado e Mapa Mental).
   - **I — Interiorização (5 min)**: Exercício "Explique para Ensinar" (Técnica de Feynman) avaliado em tempo real pela IA Tutora.
   - **V — Verificação Prática (15-20 min)**: Questões calibradas pela Teoria de Resposta ao Item (TRI) com justificativa de cada distrator.
   - **O — Organização (1 min)**: Algoritmo SM-2 agenda automaticamente a próxima revisão para evitar a curva de esquecimento.

2. **Índice de Proficiência (IP de 0 a 1000)**:
   - Medição contínua da probabilidade de acerto na escala oficial do ENEM.
   - **Nota Estimada Global** comparada em tempo real com a nota de corte do curso-alvo (ex: Medicina / USP).

3. **Modo Fortaleza (Anti-Procrastinação)**:
   - Contrato de intenção de 15 segundos (quando, onde, o que exatamente).
   - Pomodoro adaptativo com tela cheia.
   - Botão de 1 clique *"Fui distraído"* sem julgamento ou culpa.
   - Seguro de sequência (*Dia Coringa*) 1x por semana.

4. **Laboratório de Redação Nota 1000**:
   - Cronômetro de prova real (1h15).
   - Banco de repertórios socioculturais contextuais.
   - Diagnóstico nas 5 competências oficiais do Inep (0 a 200 cada).

---

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Lucide React, Framer Motion, Canvas Confetti, Recharts.
- **Backend & IA**: Next.js Server Endpoints, SDK `@google/genai` (Google Gemini 2.5 Flash).
- **Banco de Dados**: Supabase (PostgreSQL relacional com RLS, triggers e funções SQL).

---

## 🚀 Como Executar

### 1. Clonar e Instalar Dependências
```bash
git clone https://github.com/theet07/Enem.git
cd Enem
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional)
Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```
- Insira sua `GEMINI_API_KEY` obtida em [Google AI Studio](https://aistudio.google.com/).
- Insira suas credenciais do Supabase (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

### 3. Rodar o Servidor Local
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 4. Banco de Dados Supabase
Execute o script em [`supabase/schema.sql`](supabase/schema.sql) no SQL Editor do seu projeto Supabase para criar as tabelas, funções TRI e seeds pedagógicos.
