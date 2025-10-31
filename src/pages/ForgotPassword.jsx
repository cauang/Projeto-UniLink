import { useState } from 'react';
import api from '../api/http';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(!email) return toast.error('Preencha o e-mail');
    setLoading(true);
    try{
      await api.post('/auth/forgot-password', { email });
      toast.success('Se o e-mail existir, você receberá instruções para redefinir a senha.');
    }catch(err){
      toast.error(err.response?.data?.message || 'Erro ao enviar instruções');
    }finally{setLoading(false)}
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Esqueci minha senha</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm">E-mail</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded px-3 py-2 bg-slate-100" placeholder="seu@email.com" />
          <button disabled={loading} className="mt-4 w-full bg-blue-600 text-white py-2 rounded">{loading? 'Enviando...':'Enviar instruções'}</button>
        </form>
        <div className="mt-4 text-sm">
          <Link to="/login" className="text-blue-600">Voltar ao login</Link>
        </div>
      </div>
    </main>
  )
}
