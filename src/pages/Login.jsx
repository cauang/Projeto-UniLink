import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function LoginSplit() {
  return (
    <main className="min-h-screen w-full">
      {/* Split 50/50, sem container limitando largura */}
      <section className="grid min-h-screen grid-cols-1 md:grid-cols-2 gap-[15%]">
        <div className="relative bg-[#1E40FF] flex items-center justify-center overflow-hidden">
          <div className="relative bg-white z-10 w-[340px] h-[460px] overflow-hidden rounded-[100%] shadow-2xl">
            <img src="/public/unifor.jpg" alt="Entrada da Unifor" className="h-full w-full object-cover" />
          </div>
        </div>

        {/* DIREITA (form de acesso) */}
        
        <div className="bg-white flex-1 items-center justify-center px-6 py-10">
          <Link to="/" className="mb-4 text-sm text-slate-600">← Voltar</Link>
                  
          <div className="w-full max-w-xl  bg-white p-6 md:p-10">
            
            {/* topo/voltar opcional */}
            <h1 className="text-center text-[20px] md:text-[22px] font-semibold">Acesso ao Unilink</h1>
            <p className="mt-2 text-center text-sm text-slate-600">
              Unilink: Onde alunos encontram oportunidades de aprendizado colaborativo
            </p>

            <form className="mt-8">
              <label htmlFor="matricula" className="block text-sm font-medium text-slate-700">Matrícula</label>
              <input
                id="matricula"
                className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none"
                placeholder="Digite sua matrícula"
              />

              <label htmlFor="senha" className="mt-5 block text-sm font-medium text-slate-700">Senha</label>
              <input
                id="senha"
                type="password"
                className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none"
                placeholder="Digite sua senha"
              />

              <label className="mt-4 flex items-center gap-2 text-sm text-slate-700 select-none">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#1E40FF] focus:ring-[#1E40FF]" />
                Lembrar identificação de usuário
              </label>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-[#1E40FF] px-4 py-3 font-semibold text-white hover:bg-[#1b3ae0] active:bg-[#1732c6]"
              >
                Acessar
              </button>

              <div className="mt-3 text-center">
                <a href="#" className="text-sm text-slate-600 hover:underline">Esqueceu sua senha?</a>
                <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
                  Acesse a página do <span className="underline">Unifor Online</span> e clique em “Esqueci sua senha”.<br />
                  Aguarde 1 hora antes de tentar novamente.
                </p>
              </div>

              <div className="mt-6 h-px w-full bg-slate-200" />
              <p className="mt-4 text-center text-sm text-slate-700">
                Ainda não tem uma conta? <a className="text-[#1E40FF] hover:underline" href="/cadastro">Cadastre-se agora</a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
