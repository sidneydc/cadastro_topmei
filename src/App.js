import React, { useState, useEffect } from 'react';
import { supabase } from './config/supabaseClient'; // Importe o cliente Supabase
import TelaLogin from './pages/Login';
import DashboardCliente from './pages/dashboards/DashboardCliente';
import DashboardProfissional from './pages/dashboards/DashboardProfissional';
import { LogOut, Bell } from 'lucide-react';

// Componentes de UI (Placeholder)
const Card = ({ titulo, valor, cor }) => (
  <div className={`p-4 rounded-lg shadow-md bg-white border-t-4 border-${cor}-500`}>
    <p className="text-sm font-medium text-gray-500">{titulo}</p>
    <p className={`mt-1 text-2xl font-bold text-${cor}-600`}>{valor}</p>
  </div>
);

const NotificacaoBar = ({ mensagem }) => (
  <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4 rounded-lg">
    <p className="font-medium">{mensagem}</p>
  </div>
);

// Componente principal que gerencia a sessão
export default function App() {
  const [session, setSession] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar o perfil do usuário e definir o tipo
    const fetchUserProfile = async (user) => {
      if (!user) {
        setTipoUsuario(null);
        setLoading(false);
        return;
      }
      
      // Lógica temporária para definir o tipo de usuário (será substituída por uma busca no BD)
      // Idealmente, esta lógica usaria uma tabela 'profiles' para mapear o user.id para 'cliente' ou 'profissional'
      if (user.email.includes('contador')) {
        setTipoUsuario('profissional');
      } else {
        setTipoUsuario('cliente');
      }
      setLoading(false);
    };

    // 1. Busca a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    // 2. Escuta mudanças na autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    // Limpa a inscrição
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-teal-600">Carregando aplicação...</p>
      </div>
    );
  }

  if (!session) {
    return <TelaLogin />;
  }

  // O tipo de usuário é definido no useEffect
  if (tipoUsuario === 'cliente') {
    return <DashboardCliente session={session} Card={Card} NotificacaoBar={NotificacaoBar} />;
  }

  if (tipoUsuario === 'profissional') {
    return <DashboardProfissional session={session} Card={Card} NotificacaoBar={NotificacaoBar} />;
  }

  // Caso o usuário esteja logado, mas o tipo não foi definido (erro ou falta de perfil)
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <p className="text-lg text-red-600">Erro: Usuário logado sem perfil associado.</p>
    </div>
  );
}

