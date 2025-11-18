import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import CircleSmall from "../components/CircleSmall";
import CircleLarge from "../components/CircleLarge";
import DecorativeDots from "../components/DecorativeDots";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* --- ELEMENTOS DECORATIVOS DE FUNDO --- */}
      {/* Bolinhas no canto superior direito (como na Home) */}
      <DecorativeDots className="absolute top-10 right-10 opacity-30 text-[#003153]" />
      
      {/* Círculo Grande no canto inferior esquerdo */}
      <CircleLarge className="absolute -bottom-20 -left-20 opacity-20 pointer-events-none" />
      
      {/* Círculo Pequeno flutuando perto do centro */}
      <CircleSmall className="absolute top-20 left-20 opacity-20 hidden md:block pointer-events-none" />

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="relative z-10 text-center px-4 max-w-lg w-full">
        
        {/* Número 404 Grande com Efeito */}
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-[#1E40FF] tracking-widest drop-shadow-sm">
            404
          </h1>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10">
             {/* Sombra/Efeito duplicado sutil para profundidade */}
             <h1 className="text-9xl font-extrabold text-[#003153] tracking-widest transform translate-x-1 translate-y-1">
              404
            </h1>
          </div>
        </div>

        {/* Mensagem de Erro */}
        <div className="mt-4 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-2">
            <AlertTriangle size={32} className="text-[#1E40FF]" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Página não encontrada
          </h2>
          
          <p className="text-gray-500 text-lg leading-relaxed">
            Ops! Parece que você tentou acessar uma página que não existe ou o link pode ter expirado.
          </p>
        </div>

        {/* Botão de Ação */}
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#1E40FF] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <Home size={20} />
            Voltar ao Início
          </Link>
        </div>
      </div>
      
      {/* Rodapé sutil ou Copyright fixo se quiser */}
      <div className="absolute bottom-6 w-full text-center text-gray-400 text-sm">
        Unilink © {new Date().getFullYear()}
      </div>
    </div>
  );
}