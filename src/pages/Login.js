import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    // Chama a função de login do Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      setErro('E-mail ou senha inválidos. Verifique suas credenciais.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entre com suas credenciais para continuar.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{erro}</span>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Campo de E-mail */}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Endereço de E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            {/* Campo de Senha */}
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {loading ? 'Acessando...' : 'Acessar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

