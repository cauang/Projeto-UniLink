import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <div className="h-screen overflow-auto flex flex-col">
      <Navbar />
      <section className="flex-1 bg-[#155DFC] flex items-center justify-center min-h-fit">
        <div className="container-page py-6 md:py-8">
          <div className="grid md:grid-cols-2 gap-0 items-center">
            {/* Texto à esquerda */}
            <div className="text-white relative">
              {/* círculo decorativo */}
              <div className="absolute -left-6 -top-6 h-35 w-35 rounded-full border border-white/10" />
              <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Seja um<br/>Voluntário
              </h1>
              <p className="mt-2 text-white/80 max-w-md leading-relaxed whitespace-pre-line">
                "Conecte-se com alunos da Unifor e contribua para atividades práticas em diversos cursos!
                Cadastre-se no Unilink e ajude colegas de diferentes áreas enquanto ganha experiência valiosa.
                Faça a diferença agora mesmo!"
              </p>
              <div className="mt-6">
                <Link to="/sobre" className="btn-white">PARTICIPAR</Link>
              </div>
              </div>

              {/* Cartão informativo em fluxo para alinhar com o título e ser responsivo */}
              <div className="mt-8 md:mt-12">
                <div className="bg-[#003153] text-white max-w-md w-full h-auto md:h-[193px] shadow-lg rounded-md flex items-center justify-start p-6">
                  <p className="font-normal text-white text-left text-lg leading-snug whitespace-pre-line">
                    {"Conecte-se com\n alunos da Unifor e\n contribua para \natividades práticas!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Imagem à direita com círculos */}
            <div className="relative z-[2] flex justify-center">
              <img
                src="/hero.png"
                alt="Mãos conectando linhas coloridas"
                className="w-full max-w-lg h-auto rounded-md mx-auto"
              />
              {/* círculo decorativo à direita */}
              <div className="hidden md:block absolute -right-35 top-1 h-[253px] w-[253px] rounded-full border-6 border-white/10 z-[1]" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
