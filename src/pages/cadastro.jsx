import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/http";

export function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    curso: "",
    matricula: "",
    email: "",
    telefone: "",
    senha: "",
    semestre: "",
    biografia: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validação simples
    if (!form.nome || !form.curso || !form.matricula || !form.email || !form.senha || !form.semestre) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        ...form
      });
      toast.success("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full">
      <section className="grid min-h-screen grid-cols-1 md:grid-cols-2 gap-0">
        {/* ESQUERDA (imagem e formas) */}
        <div className="relative bg-[#1E40FF] hidden md:flex items-center justify-center overflow-hidden">
          {/* SVG da mancha verde clara (maior) - Z-index menor para ficar atrás */}
          <svg className="absolute w-[530px] h-[607px]" viewBox="0 0 530 607" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 1, transform: 'translateY(-10px) translateX(-20px)' }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M243.061 4.70984C344.08 -11.5616 469.016 13.1371 518.064 97.4432C564.291 176.902 462.842 257.032 441.159 345.214C419.587 432.942 480.924 558.045 394.922 598.235C309.015 638.381 231.579 530.417 151.752 480.458C93.4621 443.979 22.1083 417.422 4.45926 353.873C-13.6655 288.611 26.8081 227.115 65.6198 170.319C112.978 101.017 156.485 18.6548 243.061 4.70984Z" fill="#94FF8D" />
          </svg>

          {/* SVG da mancha verde escura (menor) - Z-index intermediário */}
          <svg className="absolute w-[426px] h-[561px]" viewBox="0 0 526 661" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 2, transform: 'translateY(10px) translateX(20px)' }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M247.031 4.45225C311.888 13.4938 365.692 60.4527 413.925 117.438C465.431 178.291 524.477 243.638 525.969 334.006C527.477 425.385 473.786 499.204 421.23 560.054C372.224 616.793 312.485 649.937 247.031 656.962C174.47 664.749 92.5661 668.06 41.4209 600.816C-9.56762 533.778 1.65128 428.197 1.39478 334.006C1.13687 239.295 -10.7804 133.383 39.9626 65.3046C91.111 -3.31772 173.881 -5.74547 247.031 4.45225Z" fill="#B3FFAE" />
          </svg>

          {/* Container para a imagem */}
          <div className="absolute z-10 w-[360px] h-[480px] border-8 border-white rounded-full overflow-hidden shadow-2xl flex items-center justify-center">
            <img src="/Up.png" alt="Entrada da Unifor" className="h-full w-full object-cover" />
          </div>
        </div>
        
        <div className="bg-white flex items-center justify-center px-6 py-10 min-h-screen overflow-y-auto">
          <div className="w-full max-w-xl bg-white p-6 md:p-10">
            <Link to="/login" className="inline-flex items-center gap-1 mb-4 text-sm text-slate-600 hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Voltar para o login
            </Link>
            <h1 className="text-center text-[20px] md:text-[22px] font-semibold">Cadastro no Unilink</h1>
            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nome*</label>
                  <input name="nome" value={form.nome} onChange={handleChange} className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none" placeholder="Nome completo" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Curso*</label>
                  <input name="curso" value={form.curso} onChange={handleChange} className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none" placeholder="Curso" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Matrícula*</label>
                  <input name="matricula" value={form.matricula} onChange={handleChange} className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none" placeholder="Matrícula" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Email*</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none" placeholder="Email" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Telefone</label>
                  <input name="telefone" value={form.telefone} onChange={handleChange} className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none" placeholder="Telefone" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Senha*</label>
                  <input name="senha" type="password" value={form.senha} onChange={handleChange} className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none" placeholder="Senha" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Semestre*</label>
                  <input name="semestre" value={form.semestre} onChange={handleChange} className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none" placeholder="Semestre" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Biografia</label>
                  <textarea name="biografia" value={form.biografia} onChange={handleChange} className="mt-2 w-full rounded-xl bg-slate-200/60 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-slate-200 outline-none" placeholder="Fale um pouco sobre você" rows="3" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-[#1E40FF] px-4 py-3 font-semibold text-white hover:bg-[#1b3ae0] active:bg-[#1732c6] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}