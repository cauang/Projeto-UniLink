import React, { useState, useCallback, Children } from "react";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import {
  GraduationCap, MessageSquare, Users, BookOpen, ShieldCheck,
  Heart, UserPlus, Star, Medal, CheckSquare, BarChart3,
  TrendingUp, Sparkles, Loader2,
  Calendar,
  Group,
  User
} from "lucide-react";

const PRIMARY_BLUE = "#1E40FF";
const LIGHT_GREEN = "#94FF8D";
const PROCEDURE_BG_COLOR = "#F9FAFB";

// Puxe do .env (Vite): crie .env com VITE_GEMINI_API_KEY=xxx
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

const responseSchema = {
  type: "OBJECT",
  properties: {
    procedure: { type: "STRING" },
    title: { type: "STRING" },
    description: { type: "STRING" },
  },
  required: ["procedure", "title", "description"],
};

// --- Gemini API ---
const geminiApiCall = async (userQuery) => {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const systemPrompt =
    "Aja como um conselheiro académico e assistente de mentoria da Unifor. Analise a dificuldade do aluno e proponha: 1) O tipo de 'procedure' mais adequado e 2) Um 'title' e 'description' claros e estruturados para um voluntário. O 'procedure' deve ser estritamente um destes: 'Mentoria entre Pares', 'Grupos de Estudo', 'Revisão de Conteúdo', ou 'Suporte Técnico'. Responda em Português de Portugal.";

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { responseMimeType: "application/json", responseSchema },
  };

  let attempts = 0;
  const maxRetries = 3;

  while (attempts < maxRetries) {
    try {
      const r = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        if (r.status === 429 && attempts < maxRetries - 1) {
          await new Promise((res) => setTimeout(res, Math.pow(2, attempts) * 1000));
          attempts++;
          continue;
        }
        throw new Error(`API error: ${r.status} ${r.statusText}`);
      }
      const json = await r.json();
      const textPart = json.candidates?.[0]?.content?.parts?.[0]?.text;
      return textPart ? JSON.parse(textPart) : null;
    } catch (err) {
      if (attempts < maxRetries - 1) {
        await new Promise((res) => setTimeout(res, Math.pow(2, attempts) * 1000));
        attempts++;
      } else {
        throw err;
      }
    }
  }
  return null;
};

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="p-6 rounded-2xl shadow-lg border border-slate-100 transition duration-300 hover:shadow-xl bg-white flex-1 min-w-[280px]">
    <div
      className="p-3 rounded-full inline-block mb-4 shadow-sm"
      style={{ backgroundColor: color === "blue" ? "#EBF0FF" : "#E6FFE5" }}
    >
      <Icon size={24} style={{ color: color === "blue" ? PRIMARY_BLUE : "#4CAF50" }} />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const Sobre = () => {
  const [userNeed, setUserNeed] = useState("");
  const [refinedSuggestion, setRefinedSuggestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const comoFuncionaData = [
    { icon: Users, title: "Cadastro Seguro", description: "Faça login com sua matrícula Unifor. Apenas alunos da universidade têm acesso à plataforma, garantindo segurança e confiabilidade.", color: "blue" },
    { icon: Calendar, title: "Busque ou Publique", description: "Alunos de Odontologia publicam solicitações de procedimentos. Voluntários buscam e se inscrevem nos que mais lhes interessam.", color: "green" },
    { icon: CheckSquare, title: "Confirmação & Atendimento", description: "Receba confirmação do agendamento e lembretes automáticos. Tudo organizado em um só lugar para sua comodidade.", color: "" },
  ];

  const procedimentosData = [
    { icon: MessageSquare, title: "Mentoria entre Pares", description: "Ajuda individualizada em matérias específicas.", color: "blue" },
    { icon: Users, title: "Grupos de Estudo", description: "Criação de grupos para aprender em equipa.", color: "blue" },
    { icon: BookOpen, title: "Revisão de Conteúdo", description: "Receba feedback em trabalhos e artigos.", color: "blue" },
    { icon: ShieldCheck, title: "Suporte Técnico", description: "Auxílio com ferramentas e sistemas académicos.", color: "blue" },
  ];

  const handleRefineRequest = useCallback(async () => {
    if (!userNeed.trim()) {
      setRefinedSuggestion({ error: "Por favor, descreva a sua necessidade antes de refinar." });
      return;
    }
    setIsLoading(true);
    setRefinedSuggestion(null);
    try {
      const query = `Minha dificuldade é: ${userNeed}. Qual o melhor tipo de procedimento e como devo estruturar meu pedido?`;
      const result = await geminiApiCall(query);
      setRefinedSuggestion(result || { error: "Não foi possível gerar uma sugestão. Tente novamente." });
    } catch {
      setRefinedSuggestion({ error: "Ocorreu um erro de rede. Verifique a consola." });
    } finally {
      setIsLoading(false);
    }
  }, [userNeed]);

  return (
    
    <div className="min-h-screen font-sans bgwhite">
      <header className="py-20 md:py-32 text-white text-center rounded-b-3xl shadow-xl" style={{ backgroundColor: PRIMARY_BLUE }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Bem-vindo ao <span style={{ color: LIGHT_GREEN }}>Unilink</span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 mb-8">
            Conectando talentos, fomentando o aprendizado colaborativo e impulsionando a excelência académica na Unifor.
          </p>
          <a href="#funciona" className="inline-flex items-center justify-center px-8 py-3 rounded-full shadow-lg text-slate-900 bg-white hover:bg-slate-100 transition">
            Saiba Mais
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Como funciona */}
        <section id="funciona" className="mb-20">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Como Funciona</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {comoFuncionaData.map((d, i) => <FeatureCard key={i} {...d} />)}
          </div>
        </section>

        {/* Procedimentos */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Procedimentos Disponíveis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {procedimentosData.map((d, i) => (
              <div key={i} className="p-4 rounded-xl shadow-sm border border-slate-200" style={{ backgroundColor: PROCEDURE_BG_COLOR }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full flex-shrink-0 border bg-white" style={{ borderColor: PRIMARY_BLUE }}>
                    <d.icon size={20} style={{ color: PRIMARY_BLUE }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-0.5">{d.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{d.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Segurança/Qualidade */}
        <section className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Segurança e Qualidade</h2>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: "#FFD70030" }}>
                <Star size={32} className="text-yellow-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-1">Feedback</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: "#00800030" }}>
                <ShieldCheck size={32} className="text-green-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-1">Verificação</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: "#1E40FF30" }}>
                <Medal size={32} style={{ color: PRIMARY_BLUE }} />
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-1">Certificação</p>
            </div>
          </div>
        </section>

        {/* Assistente AI */}
        <section className="mb-20 p-8 rounded-2xl shadow-2xl" style={{ backgroundColor: PRIMARY_BLUE }}>
          <h2 className="text-3xl font-bold text-center text-white mb-6 flex items-center justify-center">
            <Sparkles size={32} className="mr-2 text-yellow-300" />
            Assistente de Pedidos Académicos (AI)
          </h2>
          <p className="text-lg text-white text-center opacity-80 mb-8">
            Descreva a sua dificuldade. A nossa IA refina a sua solicitação para encontrar o voluntário perfeito!
          </p>

          <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <label htmlFor="user-need" className="block text-sm font-medium text-slate-700 mb-2">
              Em que disciplina ou área precisa de apoio?
            </label>
            <textarea
              id="user-need"
              rows={3}
              value={userNeed}
              onChange={(e) => setUserNeed(e.target.value)}
              placeholder="Ex: Tenho dificuldade em Cálculo I, na parte de integrais de superfície..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition text-sm resize-none"
            />
            <button
              onClick={handleRefineRequest}
              disabled={isLoading}
              className={`w-full mt-4 flex items-center justify-center px-4 py-3 font-semibold rounded-full text-slate-900 shadow-md transition ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:brightness-95"}`}
              style={{ backgroundColor: LIGHT_GREEN }}
            >
              {isLoading ? <><Loader2 size={20} className="animate-spin mr-2" />A Refinar Pedido...</> : <><Sparkles size={20} className="mr-2" />Gerar Pedido Refinado</>}
            </button>

            {refinedSuggestion && (
              <div className="mt-6 p-4 border-l-4 rounded-r-lg" style={{ borderColor: PRIMARY_BLUE, backgroundColor: PROCEDURE_BG_COLOR }}>
                {refinedSuggestion.error ? (
                  <p className="text-red-600 font-medium">{refinedSuggestion.error}</p>
                ) : (
                  <>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Sugestão de Pedido:</h4>
                    <div className="space-y-2 text-sm text-slate-700">
                      <p><span className="font-semibold text-gray-900">Procedimento Sugerido:</span> <span className="font-bold" style={{ color: PRIMARY_BLUE }}>{refinedSuggestion.procedure}</span></p>
                      <p><span className="font-semibold text-gray-900">Título:</span> {refinedSuggestion.title}</p>
                      <p><span className="font-semibold text-gray-900">Descrição para o Voluntário:</span> {refinedSuggestion.description}</p>
                    </div>
                    <p className="mt-3 text-xs text-slate-500 italic">Use esta estrutura para criar o seu pedido oficial na plataforma!</p>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="py-8 text-white text-center shadow-inner" style={{ backgroundColor: PRIMARY_BLUE }}>
        <div className="container mx-auto px-4 flex flex-wrap justify-around items-center">
          <div className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">500+ <p className="text-sm font-light opacity-80">Parcerias Feitas</p></div>
          <div className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">300+ <p className="text-sm font-light opacity-80">Horas Acumuladas</p></div>
          <div className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">150+ <p className="text-sm font-light opacity-80">Voluntários Ativos</p></div>
          <div className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">4.9⭐ <p className="text-sm font-light opacity-80">Avaliação Média</p></div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Pronto para Participar?</h2>
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8">
          <div className="flex-1 min-w-[300px] max-w-sm p-6 rounded-2xl shadow-xl border-2 transition bg-white hover:shadow-2xl" style={{ borderColor: LIGHT_GREEN }}>
            
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="text-red-500 mr-2" /> <Heart size={24} className="text-red-500 mr-2" /> Quero me Voluntariar
            </h3>
            <p className="text-sm text-slate-600 mb-6">Receba tratamento odontológico gratuito e ajude na formação de futuros dentistas</p>
            <ul className="space-y-2 text-slate-700 mb-8">
              <li><span className="text-green-600 mr-2"></span> O que você ganha:</li>
              <li className="flex items-center text-sm"><span className="text-green-600 mr-2">✓</span> Tratamentos odontológicos 100% gratuitos</li>
              <li className="flex items-center text-sm"><span className="text-green-600 mr-2">✓</span> Atendimento de qualidade supervisionado</li>
              <li className="flex items-center text-sm"><span className="text-green-600 mr-2">✓</span> Horários flexíveis que se encaixam na sua rotina</li>
              <li className="flex items-center text-sm"><span className="text-green-600 mr-2">✓</span> Pontos de colaboração e certificados</li>
            </ul>
            <Link to="/login" className="w-full inline-flex items-center justify-center px-4 py-3 font-semibold rounded-full text-slate-900 shadow-md transition hover:brightness-95" style={{ backgroundColor: LIGHT_GREEN }}>
              Fazer Login como Voluntário<Heart size={20} className=" ml-2 text-red-500 mr-2" />
            </Link>
          </div>

          <div className="flex-1 min-w-[300px] max-w-sm p-6 rounded-2xl shadow-xl border-2 transition bg-white hover:shadow-2xl" style={{ borderColor: PRIMARY_BLUE }}>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <UserPlus size={24} style={{ color: PRIMARY_BLUE }} className="mr-2" /> Sou Aluno de Odontologia
            </h3>
            <p className="text-sm text-slate-600 mb-6">Encontre voluntários para seus procedimentos práticos de forma rápida e organizada</p>
            <ul className="space-y-2 text-slate-700 mb-8">
              <li><span className="text-green-600 mr-2"></span> O que você ganha:</li>
              <li className="flex items-center text-sm"><span className="text-blue-600 mr-2">✓</span>Encontre voluntários facilmente na comunidade Unifor</li>
              <li className="flex items-center text-sm"><span className="text-blue-600 mr-2">✓</span> Sistema completo de agendamento e notificações</li>
              <li className="flex items-center text-sm"><span className="text-blue-600 mr-2">✓</span> Elimine custos com voluntários externos</li>
              <li className="flex items-center text-sm"><span className="text-blue-600 mr-2">✓</span> Organize todos seus procedimentos em um lugar</li>
            </ul>
            <Link to="/login" className="w-full inline-flex items-center justify-center px-4 py-3 font-semibold rounded-full text-white shadow-md transition hover:opacity-90" style={{ backgroundColor: PRIMARY_BLUE }}>
              Solicitar Apoio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sobre;
