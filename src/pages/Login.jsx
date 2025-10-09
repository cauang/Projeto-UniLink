import { useState } from "react";
import api from "../api/http";
import useAuth from "../store/useAuth";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, Card, Input } from "../components/Ui";

export default function Login() {
  const setToken = useAuth((s) => s.setToken);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tId = toast.loading("Entrando...");
    try {
      const { data } = await api.post("/auth/login", { email, senha });
      setToken(data?.token || "");
      toast.success("Login realizado com sucesso.", { id: tId });
    } catch {
      toast.error("Falha no login. Confira suas credenciais.", { id: tId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <Card className="max-w-md mx-auto p-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/20">
            <ShieldCheck className="text-blue-400" size={18} />
          </span>
          <div>
            <h1 className="text-xl font-bold leading-tight">Acessar o Unilink</h1>
            <p className="text-neutral-400 text-sm">Use seu e-mail e senha institucional.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-300 mb-1 block">E-mail</label>
            <Input
              placeholder="aluno@unifor.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

        <div>
            <label className="text-sm text-neutral-300 mb-1 block">Senha</label>
            <div className="relative">
              <Input
                placeholder="********"
                type={show ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute inset-y-0 right-2 my-auto p-1.5 rounded-lg hover:bg-neutral-800"
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" size={18} /> Entrando...</> : "Entrar"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
