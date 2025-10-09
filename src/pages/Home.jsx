import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      {/* HERO azul escuro */}
      <section className="relative bg-[#0b2f4f]">
        <div className="container-page py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Texto à esquerda */}
            <div className="text-white relative">
              {/* círculo decorativo */}
              <div className="absolute -left-6 -top-6 h-35 w-35 rounded-full border border-white/10" />
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Seja um<br/>Voluntário
              </h1>
              <p className="mt-2 text-white/80 max-w-md leading-relaxed">
                Conecte-se com alunos da Unifor e contribua para atividades práticas em diversos cursos!
                Cadastre-se no Unilink e ajude colegas de diferentes áreas enquanto ganha experiência valiosa.
                Faça a diferença agora mesmo!
              </p>
              
              <div className="mt-6">
                <Link to="/login" className="btn-white">PARTICIPAR</Link>
              </div>
              <section className="absolute -bottom-28.5 left-20 w-full">
              <div className="container-page">
                <div className="relative">
                  <div className="md:absolute md:-top-10 md:left-8">
                    <div className="bg-[#6ee7b7] text-[#083344] w-448px h-193px shadow-lg px-6 py-5 border rounded-md border-emerald-200">
                      <p className="font-semibold fort-sans text-lg">
                        Conecte-se com alunos da Unifor e contribua para atividades práticas!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </section>
            </div>
          
            {/* Imagem à direita com círculos */}
            <div className="relative">
              <img
                src="/hero.png"
                alt="Mãos conectando linhas coloridas"
                className="w-515px w-671px rounded-md mx-auto"
              />
              {/* círculo decorativo à direita */}
              <div className="hidden md:block absolute -right-8 top-10 h-40 w-40 rounded-full border-2 border-white/10" />
            </div>

          </div>
        </div>

        {/* faixa branca atravessando embaixo, como no mock */}
        <div className="absolute inset-x-0 -bottom-8 h-9 bg-white"></div>
      </section>

      {/* CARD verde sobreposto */}

    </main>
  );
}
