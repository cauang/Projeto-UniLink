import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Imports dos elementos decorativos

import CircleSmall from "../components/CircleSmall.jsx";
import CircleLarge from "../components/CircleLarge.jsx";
import DecorativeDots from "../components/DecorativeDots.jsx";

export default function Home() {
  return (
    <div className="h-screen overflow-auto flex flex-col">
      <Navbar />
      
      {/* Adicionado 'relative overflow-hidden' para conter as decorações absolutas */}
      <section className="flex-1 bg-[#155DFC] flex items-center justify-center min-h-fit relative overflow-hidden">
        
        {/* --- DECORAÇÃO: BOLINHAS (Canto Superior Direito) --- */}
        {/*<DecorativeDots className="absolute top-0 right-0 mt-0 mr-0 opacity-60 md:opacity-100" />*/}

        <div className="container-page py-6 md:py-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-0 items-center">
            
            {/* Texto à esquerda */}
            <div className="text-white relative">
              
              {/* --- DECORAÇÃO: CÍRCULO PEQUENO --- */}
              <CircleSmall className="absolute -left-12 -top-10 opacity-50 md:opacity-100 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Seja um<br/>Voluntário
                </h1>
                <DecorativeDots className="absolute top-0 right-0 mt-0 mr-0 opacity-60 md:opacity-100" />
                <p className="mt-2 text-white/80 max-w-md leading-relaxed whitespace-pre-line">
                  "Conecte-se com alunos da Unifor e contribua para atividades práticas em diversos cursos!
                  Cadastre-se no Unilink e ajude colegas de diferentes áreas enquanto ganha experiência valiosa.
                  Faça a diferença agora mesmo!"
                </p>
                <div className="mt-6">
                  <Link to="/sobre" className="btn-white">PARTICIPAR</Link>
                </div>
              </div>

              {/* Cartão informativo */}
              <div className="mt-8 md:mt-12">
                <div className="bg-[#003153] text-white max-w-md w-full h-auto md:h-[193px] shadow-lg rounded-md flex items-center justify-start p-6 relative z-20">
                  <p className="font-normal text-white text-left text-lg leading-snug whitespace-pre-line">
                    {"Conecte-se com\n alunos da Unifor e\n contribua para \natividades práticas!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Imagem à direita */}
            <div className="relative z-[2] flex justify-center mt-10 md:mt-0">
              <img
                src="/hero.png"
                alt="Mãos conectando linhas coloridas"
                className="w-full max-w-lg h-auto rounded-md mx-auto relative z-10"
              />
              
              {/* --- DECORAÇÃO: CÍRCULO GRANDE --- */}
              <CircleLarge className="hidden md:block absolute -right-12 top-1/6 z-0 pointer-events-none" />
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}