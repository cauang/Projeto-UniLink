import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function LoginSplit() {
  return (
    <main className="min-h-screen w-full">
      {/* Split 50/50, sem container limitando largura */}
      <section className="grid min-h-screen grid-cols-1 md:grid-cols-2 gap-[15%]">
        <div className="relative bg-[#1E40FF] flex items-center justify-center overflow-hidden">


          <svg className="relative" xmlns="http://www.w3.org/2000/svg" width="530" height="607" viewBox="0 0 530 607" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M243.061 4.70984C344.08 -11.5616 469.016 13.1371 518.064 97.4432C564.291 176.902 462.842 257.032 441.159 345.214C419.587 432.942 480.924 558.045 394.922 598.235C309.015 638.381 231.579 530.417 151.752 480.458C93.4621 443.979 22.1083 417.422 4.45926 353.873C-13.6655 288.611 26.8081 227.115 65.6198 170.319C112.978 101.017 156.485 18.6548 243.061 4.70984Z" fill="#94FF8D"/>
          </svg>

          <svg className="relative w-[426px] h-[561px] z-1" viewBox="0 0 526 661" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M247.031 4.45225C311.888 13.4938 365.692 60.4527 413.925 117.438C465.431 178.291 524.477 243.638 525.969 334.006C527.477 425.385 473.786 499.204 421.23 560.054C372.224 616.793 312.485 649.937 247.031 656.962C174.47 664.749 92.5661 668.06 41.4209 600.816C-9.56762 533.778 1.65128 428.197 1.39478 334.006C1.13687 239.295 -10.7804 133.383 39.9626 65.3046C91.111 -3.31772 173.881 -5.74547 247.031 4.45225Z" fill="#B3FFAE"/>
          </svg>

          <div className="relative bg-white z-10 w-[340px] h-[460px] overflow-hidden rounded-[100%] shadow-2xl">
            <img src="/public/Up.png" alt="Entrada da Unifor" className="h-full w-full object-cover" />
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
