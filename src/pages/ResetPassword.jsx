import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/http';
import { toast } from 'react-hot-toast';

export default function ResetPassword(){
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [ok, setOk] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!token) return;
    (async ()=>{
      try{
        await api.get('/auth/validate-reset', { params: { token } });
        setOk(true);
      }catch(err){
        toast.error(err.response?.data?.message || 'Token inválido ou expirado');
      }
    })()
  },[token])

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!newPass) return toast.error('Digite a nova senha');
    setLoading(true);
    try{
      await api.post('/auth/reset-password', { token, senha: newPass });
      toast.success('Senha alterada com sucesso');
      navigate('/login');
    }catch(err){
      toast.error(err.response?.data?.message || 'Erro ao alterar senha');
    }finally{setLoading(false)}
  }

  if(!token) return <div className="p-6">Token não informado</div>

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Redefinir senha</h2>
        {ok ? (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm">Nova senha</label>
            <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} className="mt-2 w-full rounded px-3 py-2 bg-slate-100" />
            <button disabled={loading} className="mt-4 w-full bg-blue-600 text-white py-2 rounded">{loading? 'Alterando...':'Alterar senha'}</button>
          </form>
        ) : (
          <div>Validando token...</div>
        )}
      </div>
    </main>
  )
}
