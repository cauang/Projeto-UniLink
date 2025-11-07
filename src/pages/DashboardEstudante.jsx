import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/http";
import useAuth from "../store/useAuth";

export default function DashboardEstudante() {
  const [procedimentos, setProcedimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirecionar se não estiver autenticado ou não for estudante
    if (!user || user.tipo_usuario !== "Estudante") {
      navigate("/login");
      return;
    }

    const fetchProcedimentos = async () => {
      try {
        const response = await api.get("/procedimentos/meus-procedimentos");
        setProcedimentos(response.data);
      } catch (error) {
        console.error("Erro ao carregar procedimentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedimentos();
  }, [navigate, user]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Meus Procedimentos</h1>

      {procedimentos.length === 0 ? (
        <p>Você ainda não tem nenhum procedimento cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {procedimentos.map((proc) => (
            <div
              key={proc.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{proc.titulo}</h3>
              <p className="text-gray-600 mb-4">
                Data: {new Date(proc.data).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    proc.status === "Confirmado"
                      ? "bg-green-100 text-green-800"
                      : proc.status === "Pendente"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {proc.status}
                </span>
                <button
                  onClick={() => navigate(`/procedimento/${proc.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}