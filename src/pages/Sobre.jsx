import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import {
  Heart,
  Stethoscope,
  UserPlus,
  Star,
  ShieldCheck,
  Award,
  Users,
  Search,
  CheckCircle,
  ClipboardList,
  Smile,
  GraduationCap,
  FileCheck,
  ThumbsUp,
  Sparkles,
  Radio,
  Layers,
  FileText,
  Lock,
  University,
  Bell,
  ArrowRight, 
} from "lucide-react";

// --- Constantes de Cor ---
const PRIMARY_BLUE = "#1E40FF";
const LIGHT_GREEN = "#94FF8D"; // Verde claro para bordas
const BUTTON_GREEN = "#22C55E"; // Verde escuro para botão
const LIGHT_BLUE_BG = "#F0F5FF"; // Fundo azul bem claro para cards
const LIGHT_GREEN_BG = "#F0FFF4"; // Fundo verde bem claro para cards

// --- Componentes Internos da Página ---

// Card para "Como Funciona"
const ComoFuncionaCard = ({ icon: Icon, title, description, color, step }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-[320px] w-full">
    <div
      className={`p-4 rounded-full mb-2 inline-flex ${
        color === "blue"
          ? "bg-blue-100"
          : color === "green"
          ? "bg-green-100"
          : "bg-purple-100"
      }`}
    >
      <Icon
        size={28}
        className={
          color === "blue"
            ? "text-blue-600"
            : color === "green"
            ? "text-green-600"
            : "text-purple-600"
        }
      />
    </div>
    {/* Círculo do número */}
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-3 ${
        color === "blue"
          ? "bg-blue-600"
          : color === "green"
          ? "bg-green-600"
          : "bg-purple-600"
      }`}
    >
      {step}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Card para "Procedimentos Disponíveis"
const ProcedimentoCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 h-full">
    <div className="p-2 bg-blue-600 rounded-lg mr-3 flex-shrink-0">
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

// Card para "Segurança e Qualidade"
const SegurancaCard = ({ icon: Icon, title, description, color }) => (
  <div className="flex flex-col items-center text-center max-w-[200px]">
    <div
      className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${color}`}
    >
      <Icon size={32} className="text-white" />
    </div>
    <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// --- Componente Principal ---
const Sobre = () => {
  // Dados baseados no screenshot
  const comoFuncionaData = [
    {
      icon: Users,
      title: "Cadastro Seguro",
      description:
        "Faça login com sua matrícula Unifor. Apenas alunos da universidade têm acesso à plataforma, garantindo segurança e confiabilidade.",
      color: "blue",
      step: 1,
    },
    {
      icon: Search,
      title: "Busque ou Publique",
      description:
        "Alunos de Odontologia publicam solicitações de procedimentos. Voluntários buscam e se inscrevem nos que mais lhes interessam.",
      color: "green",
      step: 2,
    },
    {
      icon: CheckCircle,
      title: "Confirmação & Atendimento",
      description:
        "Receba confirmação do agendamento e lembretes automáticos. Tudo organizado em um só lugar para sua comodidade.",
      color: "purple",
      step: 3,
    },
  ];

  const procedimentosData = [
    {
      icon: Sparkles,
      title: "Limpeza e Profilaxia",
      description: "Remoção de tártaro e placa bacteriana",
    },
    {
      icon: ClipboardList,
      title: "Restauração",
      description: "Reparo de cáries e dentes danificados",
    },
    {
      icon: FileCheck,
      title: "Aplicação de Flúor",
      description: "Prevenção e fortalecimento dental",
    },
    {
      icon: ClipboardList,
      title: "Exame Periodontal",
      description: "Avaliação da saúde das gengivas",
    },
    {
      icon: Radio,
      title: "Radiografia",
      description: "Diagnóstico por imagem",
    },
    {
      icon: Layers,
      title: "Moldagem",
      description: "Para próteses e aparelhos",
    },
    {
      icon: ClipboardList, 
      title: "Tratamento de Canal",
      description: "Procedimentos endodônticos",
    },
    {
      icon: FileText,
      title: "Outros Procedimentos",
      description: "Consulte disponibilidade",
    },
  ];

  const segurancaData = [
    {
      icon: Lock,
      title: "Acesso Exclusivo Unifor",
      description: "Apenas alunos matriculados podem acessar a plataforma",
      color: "bg-blue-600",
    },
    {
      icon: Users,
      title: "Supervisão Profissional",
      description: "Todos os procedimentos são supervisionados por professores",
      color: "bg-green-600",
    },
    {
      icon: University,
      title: "Instalações da Unifor",
      description:
        "Procedimentos realizados nas clínicas odontológicas da universidade",
      color: "bg-purple-600",
    },
    {
      icon: Bell,
      title: "Lembretes Automáticos",
      description: "Notificações para não perder seus agendamentos",
      color: "bg-orange-600",
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Header */}
      <header
        className="py-20 md:py-28 text-white text-center rounded-b-3xl shadow-lg"
        style={{ backgroundColor: PRIMARY_BLUE }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Bem-vindo ao Unilink
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 mb-8">
            A plataforma oficial da Unifor que conecta alunos de odontologia a
            voluntários para procedimentos acadêmicos.
          </p>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full shadow-lg text-slate-900 font-semibold bg-white hover:bg-slate-100 transition"
          >
            Saiba Mais
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Como Funciona */}
        <section id="como-funciona" className="mb-16 md:mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Simples, seguro e colaborativo
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {comoFuncionaData.map((d, i) => (
              <ComoFuncionaCard key={i} {...d} />
            ))}
          </div>
        </section>

        {/* Procedimentos Disponíveis */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Procedimentos Disponíveis
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Variedade de tratamentos odontológicos gratuitos
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {procedimentosData.map((d, i) => (
              <ProcedimentoCard key={i} {...d} />
            ))}
          </div>
        </section>

        {/* Por que usar o Unilink? */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Por que usar o Unilink?
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Benefícios para toda a comunidade acadêmica
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Card Voluntários */}
            <div
              className="flex-1 min-w-[300px] max-w-md p-6 rounded-2xl shadow-lg border"
              style={{ backgroundColor: LIGHT_GREEN_BG, borderColor: "#C8E6C9" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-600 rounded-full inline-flex">
                  <Heart size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Para Voluntários
                  </h3>
                  <p className="text-sm text-gray-600">
                    Receba tratamento odontológico de qualidade gratuitamente
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold">100% Gratuito:</span> Todos
                    os procedimentos são completamente sem custo.
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold">Qualidade Garantida:</span>{" "}
                    Supervisionado por professores experientes.
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold">
                      Flexibilidade de Horário:
                    </span>{" "}
                    Escolha os procedimentos que se encaixam na sua agenda.
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold">Contribuição Social:</span>{" "}
                    Ajude na formação de futuros dentistas.
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Card Alunos */}
            <div
              className="flex-1 min-w-[300px] max-w-md p-6 rounded-2xl shadow-lg border"
              style={{ backgroundColor: LIGHT_BLUE_BG, borderColor: "#BBDEFB" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-600 rounded-full inline-flex">
                  <Stethoscope  size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Para Alunos de Odontologia
                  </h3>
                  <p className="text-sm text-gray-600">
                    Encontre voluntários para seus procedimentos práticos
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold">
                      Encontre Voluntários Facilmente:
                    </span>{" "}
                    Publique suas solicitações e receba inscrições rapidamente.
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold">
                      Organize seus Agendamentos:
                    </span>{" "}
                    Sistema completo de calendário e notificações.
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold">Comunidade Unifor:</span>{" "}
                    Voluntários são seus colegas de universidade.
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold">Sem Custos:</span> Elimine a
                    necessidade de contratar voluntários externos.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Segurança e Qualidade */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Segurança e Qualidade
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Sua confiança é nossa prioridade
          </p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {segurancaData.map((d, i) => (
              <SegurancaCard key={i} {...d} />
            ))}
          </div>
        </section>
      </main>

      {/* Barra de Estatísticas */}
      <div
        className="py-12 md:py-16 text-white text-center shadow-inner"
        style={{ backgroundColor: PRIMARY_BLUE }}
      >
        <div className="container mx-auto px-4 flex flex-wrap justify-around items-center">
          <div className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            500+
            <p className="text-sm font-light opacity-80">
              Procedimentos Realizados
            </p>
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            300+
            <p className="text-sm font-light opacity-80">Voluntários Ativos</p>
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            150+
            <p className="text-sm font-light opacity-80">Alunos de Odontologia</p>
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            <div className="flex items-center justify-center">
              4.9
              <Star size={24} className="ml-1 text-yellow-300" />
            </div>
            <p className="text-sm font-light opacity-80">Avaliação Média</p>
          </div>
        </div>
      </div>

      {/* Pronto para Participar? */}
      <section className="py-16 md:py-24 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Pronto para Participar?
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Escolha como você deseja fazer parte da comunidade Unilink
        </p>
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8">
          
          {/* Card Voluntário */}
          <div
            className="flex-1 min-w-[300px] max-w-sm p-8 rounded-2xl shadow-xl border-2 transition bg-white hover:shadow-2xl"
            style={{ borderColor: BUTTON_GREEN }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-green-600">
              <Heart size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Quero me Voluntariar
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Receba tratamento odontológico gratuito e ajude na formação de
              futuros dentistas.
            </p>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                O que você ganha:
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2"
                  />
                  Tratamentos odontológicos 100% gratuitos
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2"
                  />
                  Atendimento de qualidade supervisionado
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2"
                  />
                  Horários flexíveis que se encaixam na sua rotina
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2"
                  />
                  Pontos de colaboração e certificados
                </li>
              </ul>
            </div>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center px-4 py-3 font-semibold rounded-lg text-white shadow-md transition hover:bg-green-700"
              style={{ backgroundColor: BUTTON_GREEN }}
            >
              Fazer Login como Voluntário <Heart size={20} className="ml-2" />
            </Link>
            <p className="text-xs text-gray-500 text-center mt-3">
              Use sua matrícula Unifor para acessar
            </p>
          </div>

          {/* Card Aluno */}
          <div
            className="flex-1 min-w-[300px] max-w-sm p-8 rounded-2xl shadow-xl border-2 transition bg-white hover:shadow-2xl"
            style={{ borderColor: PRIMARY_BLUE }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-blue-600">
              <Stethoscope size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Sou Aluno de Odontologia
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Encontre voluntários para seus procedimentos práticos de forma
              rápida e organizada.
            </p>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                O que você ganha:
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-blue-600 mr-2" />
                  Encontre voluntários facilmente na comunidade Unifor
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-blue-600 mr-2" />
                  Sistema completo de agendamento e notificações
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-blue-600 mr-2" />
                  Elimine custos com voluntários externos
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-blue-600 mr-2" />
                  Organize todos seus procedimentos em um lugar
                </li>
              </ul>
            </div>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center px-4 py-3 font-semibold rounded-lg text-white shadow-md transition hover:opacity-90"
              style={{ backgroundColor: PRIMARY_BLUE }}
            >
              Fazer Login - Odontologia{" "}
              <Stethoscope size={20} className="ml-2" />
            </Link>
            <p className="text-xs text-gray-500 text-center mt-3">
              Use sua matrícula Unifor para acessar
            </p>
          </div>
        </div>
        
        {/* Dúvidas Link */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-600">
            Ainda tem dúvidas?{" "}
            <a
              href="#"
              className="font-semibold text-blue-600 hover:underline"
            >
              Entre em Contato
            </a>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Sobre;