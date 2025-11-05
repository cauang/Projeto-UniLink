import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
//import api from "../api/http";
// import useAuth from "../store/useAuth"; // Removido para evitar erro de importação

// --- Mock API para fins de demonstração ---
const mockApi = {
  post: (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Mock API Post:", url, data);

        // --- LÓGICA DE SIMULAÇÃO ATUALIZADA ---
        // Verifica se a matrícula e senha são as de teste
        if (data.matricula === "123456" && data.senha === "123456") {
          // Se sim, loga como Voluntário (sucesso)
          console.log("Simulando login de Voluntário BEM-SUCEDIDO...");
          resolve({
            data: {
              token: "fake-jwt-token-12345",
              user: {
                id: 123,
                nome: "Usuário Voluntário de Teste",
                role: "Voluntario", // <-- A função (role) do usuário
              },
            },
          });
        } else {
          // Se não, retorna um erro de senha/matrícula inválida
          console.log("Simulando login MAL-SUCEDIDO...");
          return reject({
            response: {
              data: { message: "Matrícula ou senha inválida (simulado)" },
            },
          });
        }
        // ------------------------------------------
      }, 1000);
    });
  },
};

// --- PONTO PRINCIPAL PARA TESTES ---
// Para USAR a simulação (mock), deixe esta linha ATIVA:
const api = mockApi;

// Para USAR sua API real, comente a linha acima (const api = mockApi;)
// e descomente a linha de importação no topo (import api from "../api/http";)
// ------------------------------------

// Mock da função setToken (já que useAuth não está disponível neste contexto)
const setToken = (token) => {
  console.log("Token armazenado (simulado):", token);
};
// ------------------------------------

export default function LoginSplit() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- Novo estado
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //const setToken = useAuth((state) => state.setToken); // Você usaria este no seu app real

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matricula || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        matricula,
        senha,
      });

      console.log("Resposta do servidor:", response.data);

      // 1. Armazenar o token
      setToken(response.data.token);
      toast.success("Login realizado com sucesso!");

      // 2. Lógica de redirecionamento baseado na função (role)
      const userRole = response.data.user?.role;

      if (userRole === "Voluntario") {
        navigate("/voluntarios"); // <-- ATUALIZADO: Rota do seu App.jsx
      } else {
        // Um fallback para outros tipos de usuário ou caso a função não seja definida
        console.warn(
          `Função de usuário não reconhecida: ${userRole}. Redirecionando para Home.`
        );
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full font-sans">
      <section className="grid min-h-screen grid-cols-1 md:grid-cols-2 gap-0">
        {/* ESQUERDA (imagem e formas) */}
        <div className="relative bg-[#1E40FF] hidden md:flex items-center justify-center overflow-hidden">
          {/* SVG da mancha verde clara (maior) */}
          <svg
            className="absolute w-[530px] h-[607px]"
            viewBox="0 0 530 607"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ zIndex: 1, transform: "translateY(-10px) translateX(-20px)" }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M243.061 4.70984C344.08 -11.5616 469.016 13.1371 518.064 97.4432C564.291 176.902 462.842 257.032 441.159 345.214C419.587 432.942 480.924 558.045 394.922 598.235C309.015 638.381 231.579 530.417 151.752 480.458C93.4621 443.979 22.1083 417.422 4.45926 353.873C-13.6655 288.611 26.8081 227.115 65.6198 170.319C112.978 101.017 156.485 18.6548 243.061 4.70984Z"
              fill="#94FF8D"
            />
          </svg>

          {/* SVG da mancha verde escura (menor) */}
          <svg
            className="absolute w-[426px] h-[561px]"
            viewBox="0 0 526 661"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ zIndex: 2, transform: "translateY(10px) translateX(20px)" }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M247.031 4.45225C311.888 13.4938 365.692 60.4527 413.925 117.438C465.431 178.291 524.477 243.638 525.969 334.006C527.477 425.385 473.786 499.204 421.23 560.054C372.224 616.793 312.485 649.937 247.031 656.962C174.47 664.749 92.5661 668.06 41.4209 600.816C-9.56762 533.778 1.65128 428.197 1.39478 334.006C1.13687 239.295 -10.7804 133.383 39.9626 65.3046C91.111 -3.31772 173.881 -5.74547 247.031 4.45225Z"
              fill="#B3FFAE"
            />
          </svg>

          {/* Container para a imagem */}
          <div className="absolute z-10 w-[360px] h-[480px] border-8 border-white rounded-full overflow-hidden shadow-2xl flex items-center justify-center">
            <img
              src="/public/Up.png"
              alt="Entrada da Unifor"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/360x480/1E40FF/FFFFFF?text=Imagem+Unifor";
              }}
            />
          </div>
        </div>

        {/* DIREITA (form de acesso) */}
        <div className="bg-white flex items-center justify-center px-6 py-10 min-h-screen">
          <div className="w-full max-w-xl bg-white p-6 md:p-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1 mb-4 text-sm text-slate-600 hover:text-slate-900"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>

            <h1 className="text-center text-[20px] md:text-[22px] font-semibold">
              Acesso ao Unilink
            </h1>
            <p className="mt-2 text-center text-sm text-slate-600">
              Unilink: Onde alunos encontram oportunidades de aprendizado
              colaborativo
            </p>

            <form className="mt-15" onSubmit={handleSubmit}>
              <label
                htmlFor="matricula"
                className="block text-sm font-medium text-slate-700"
              >
                Matrícula
              </label>
              <input
                id="matricula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="mt-2 w-full rounded-xl bg-[rgba(176,186,195,0.40)] px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-[rgba(176,186,195,0.50)] outline-none"
                placeholder="Digite sua matrícula"
              />

              <label
                htmlFor="senha"
                className="mt-5 block text-sm font-medium text-slate-700"
              >
                Senha
              </label>
              {/* --- Bloco da Senha Modificado --- */}
              <div className="relative w-full mt-2">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"} // <-- Dinâmico
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-xl bg-[rgba(176,186,195,0.40)] px-4 py-3 pr-10 text-slate-900 placeholder:text-slate-500 focus:bg-[rgba(176,186,195,0.50)] outline-none"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* --- Fim do Bloco da Senha --- */}

              <label className="mt-4 flex items-center gap-2 text-sm text-slate-700 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#1E40FF] focus:ring-[#1E40FF]"
                />
                Lembrar identificação de usuário
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-[#1E40FF] px-4 py-3 font-semibold text-white hover:bg-[#1b3ae0] active:bg-[#1732c6] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Acessando..." : "Acessar"}
              </button>

              <div className="mt-3 text-center">
                <a href="#" className="text-sm text-slate-600 hover:underline">
                  Esqueceu sua senha?
                </a>
                <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
                  Acesse a página do{" "}
                  <span className="underline">Unifor Online</span> e clique em
                  “Esqueci sua senha”.
                  <br />
                  Aguarde 1 hora antes de tentar novamente.
                </p>
              </div>

              <div className="mt-6 h-px w-full bg-slate-200" />
              <p className="mt-4 text-center text-sm text-slate-700">
                Ainda não tem uma conta?{" "}
                <a className="text-[#1E40FF] hover:underline" href="/cadastro">
                  Cadastre-se agora
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}