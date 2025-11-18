import { useState } from 'react';
import api from '../api/http';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react'; // Ícone para redefinição de senha

// Importamos os elementos decorativos para criar a identidade visual
import CircleSmall from '../components/CircleSmall';
import CircleLarge from '../components/CircleLarge';
import DecorativeDots from '../components/DecorativeDots';

export default function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Cor primária do projeto para facilitar a leitura
  const PRIMARY_BLUE = "#1E40FF"; 

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* --- ELEMENTOS DECORATIVOS DE FUNDO (Copiado da 404) --- */}
      <DecorativeDots className="absolute top-10 right-10 opacity-30 text-[#003153] hidden md:block" />
      <CircleLarge className="absolute -left-20 -bottom-10 opacity-20 pointer-events-none hidden lg:block" />
      <CircleSmall className="absolute top-20 right-1/4 opacity-10 pointer-events-none hidden md:block" />

      {/* --- CARTÃO PRINCIPAL (Formulário) --- */}
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-blue-50 transition-all duration-300 hover:shadow-3xl mx-6">
        
        {/* Header do Cartão */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-3 shadow-md">
            <LockKeyhole size={32} className="text-[#1E40FF]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Esqueci minha senha</h2>
          <p className="text-sm text-gray-500 mt-1">
             Insira seu e-mail para receber as instruções de redefinição.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de cadastro</label>
            <input 
              type="email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-[#1E40FF] focus:ring focus:ring-[#1E40FF]/20 transition-all" 
              placeholder="seu@email.com" 
              disabled={loading}
              required
            />
          </div>
          
          {/* Botão de Envio */}
          <button 
            type="submit"
            disabled={loading} 
            style={{ backgroundColor: PRIMARY_BLUE }}
            className="w-full text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-colors shadow-md disabled:bg-gray-400"
          >
            {loading? 'Enviando instruções...' : 'Redefinir Senha'}
          </button>
        </form>

        {/* Link Voltar */}
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-[#1E40FF] font-medium hover:underline">
            ← Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}