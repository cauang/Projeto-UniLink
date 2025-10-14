import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* Faixa azul de fundo, cobre a tela toda atrás do grid */}
      <section className="relative bg-[#0b2f4f]">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid md:grid-cols-2 items-stretch gap-0">
            {/* Lado esquerdo: blobs + foto oval */}
            <div className="relative hidden md:block">
              {/* Blob 1 (verde claro) */}
              <div
                className="absolute left-[-40px] top-[40px] w-[380px] h-[480px] bg-[#34d399] opacity-90"
                style={{
                  clipPath:
                    "path('M303 84c34 41 55 89 50 135-5 46-36 90-72 124-36 34-77 58-118 61-41 4-81-14-111-44S0 292-1 247c-2-45 10-90 37-126C63 86 105 61 150 46c44-14 91-19 125 2 34 21 54 75 28 92z')",
                }}
              />
              {/* Blob 2 (verde médio) */}
              <div
                className="absolute left-[-10px] top-[120px] w-[340px] h-[420px] bg-[#22c55e] opacity-90"
                style={{
                  clipPath:
                    "path('M286 140c23 45 22 97 2 138-20 41-60 71-99 88-40 18-79 23-114 11-35-11-66-40-77-77-11-37-1-83 24-121 25-37 63-65 105-78 41-12 86-9 112 16 26 26 24 78 47 123z')",
                }}
              />
              {/* Blob 3 (verde escuro) */}
              <div
                className="absolute left-[40px] bottom-[10px] w-[300px] h-[220px] bg-[#10b981]"
                style={{
                  borderRadius: "60% 40% 60% 40% / 55% 45% 55% 45%",
                  filter: "blur(0.5px)",
                }}
              />

              {/* Moldura oval com a foto */}
              <div className="relative z-10 ml-[90px] mt-[30px] w-[340px] h-[460px] overflow-hidden rounded-[999px] shadow-2xl ring-4 ring-white/0">
                <img
                  src="/unifor.jpg"
                  alt="Entrada da Unifor"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Lado direito: card branco com o formulário */}
            <div className="flex items-center">
              <div className="mx-auto w-full max-w-xl rounded-[28px] bg-white p-8 md:p-10 shadow-xl">
                <h1 className="text-center text-[20px] md:text-[22px] font-semibold">
                  Acesso ao Unilink
                </h1>
                <p className="mt-2 text-center text-sm text-slate-600">
                  Unilink: Onde alunos encontram oportunidades de
                  aprendizado colaborativo
                </p>

                {/* Matrícula */}
                <label className="mt-8 block text-sm font-medium text-slate-700">
                  Matrícula
                </label>
                <input
                  type="text"
                  placeholder="Digite sua matrícula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:bg-slate-200"
                />

                {/* Senha */}
                <label className="mt-5 block text-sm font-medium text-slate-700">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:bg-slate-200"
                />

                {/* Botão Acessar */}
                <button
                  className="mt-8 w-full rounded-xl bg-[#0b2f4f] px-4 py-3 font-semibold text-white transition hover:bg-[#09314f]/90 active:bg-[#082840]"
                >
                  Acessar
                </button>

                {/* Link de cadastro */}
                <p className="mt-6 text-center text-sm text-slate-600">
                  Não possui uma conta?{" "}
                  <Link to="/cadastro" className="font-medium text-emerald-600 hover:underline">
                    Cadastrar
                  </Link>
                </p>

                {/* Rodapé */}
                <p className="mt-10 text-center text-xs text-slate-500">
                  Desenvolvido pelo Grupo Unilink - Unifor 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* cantos arredondados do “card gigante” branco (efeito do mock) */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-[68%] rounded-bl-[36px] rounded-tl-[36px] bg-white/0" />
      </section>
    </main>
  );
}
