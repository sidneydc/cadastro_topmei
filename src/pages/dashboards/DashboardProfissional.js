import React, { useState } from 'react';
import { LogOut, Bell, Users, FileCheck, Settings, CheckCircle, XCircle, Clock, Search, Loader2 } from 'lucide-react';
import { supabase } from '../../config/supabaseClient';
import { useProfissionalData } from '../../hooks/useProfissionalData';
import { updateDocumentoStatus } from '../../services/profissionalService';

// Componente de Layout de Aba
const Aba = ({ titulo, icone: Icone, ativa, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
      ativa ? 'bg-teal-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icone size={20} />
    <span className="font-medium">{titulo}</span>
  </button>
);

// =================================================================================
// SUBCOMPONENTES DO DASHBOARD PROFISSIONAL
// =================================================================================

// 1. Aba Clientes
const ClientesProfissional = ({ clientes, documentosPendentes, Card }) => {
  const clientesPendentes = clientes.filter(c => c.status_cadastro !== 'aprovado').length;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Clientes Ativos</h2>
      
      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card titulo="Total de Clientes" valor={clientes.length} cor="teal" />
        <Card titulo="Clientes Pendentes" valor={clientesPendentes} cor="red" />
        <Card titulo="Documentos para Análise" valor={documentosPendentes.length} cor="yellow" />
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Lista de Clientes</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razão Social</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr key={cliente.id_cadastro}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.razao_social}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.cnpj}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cliente.status_cadastro === 'aprovado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cliente.status_cadastro}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-teal-600 hover:text-teal-900">Ver Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 2. Aba Gestão de Documentos
const DocumentosProfissional = ({ documentos, refreshData }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [modalDoc, setModalDoc] = useState(null);

  const handleStatusUpdate = async (id_documento, status) => {
    setLoadingId(id_documento);
    try {
      await updateDocumentoStatus(id_documento, status, observacao);
      setModalDoc(null);
      setObservacao('');
      refreshData(); // Recarrega a lista de documentos
    } catch (error) {
      alert(`Erro ao atualizar status: ${error.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const openModal = (doc) => {
    setModalDoc(doc);
    setObservacao(doc.observacao || '');
  };
  
  const closeModal = () => {
    setModalDoc(null);
    setObservacao('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Documentos para Análise ({documentos.length})</h2>
      
      {/* Tabela de Documentos Pendentes */}
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documentos.map((doc) => (
              <tr key={doc.id_documento}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.cadastros_clientes.razao_social}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.cadastros_clientes.cnpj}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.tipo_documento}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <a 
                    href={doc.url_documento ? supabase.storage.from('documentos-clientes').getPublicUrl(doc.url_documento).data.publicUrl : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Search size={16} className="inline mr-1" />
                    Ver
                  </a>
                  <button 
                    onClick={() => openModal(doc)}
                    className="text-teal-600 hover:text-teal-900"
                    disabled={loadingId === doc.id_documento}
                  >
                    {loadingId === doc.id_documento ? <Loader2 size={16} className="inline mr-1 animate-spin" /> : <FileCheck size={16} className="inline mr-1" />}
                    Analisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal de Análise de Documento */}
      {modalDoc && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/2 max-w-lg">
            <h3 className="font-bold text-xl mb-4">Analisar {modalDoc.tipo_documento} de {modalDoc.cadastros_clientes.razao_social}</h3>
            
            <p className="mb-2"><strong>Status Atual:</strong> {modalDoc.status_documento}</p>
            
            <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mt-4">Observações (Opcional para Aprovação, Obrigatório para Rejeição)</label>
            <textarea
              id="observacao"
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            ></textarea>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={() => handleStatusUpdate(modalDoc.id_documento, 'rejeitado')}
                disabled={loadingId || !observacao}
              >
                <XCircle size={20} />
                Rejeitar
              </button>
              <button 
                className="btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                onClick={() => handleStatusUpdate(modalDoc.id_documento, 'aprovado')}
                disabled={loadingId}
              >
                <CheckCircle size={20} />
                Aprovar
              </button>
              <button 
                className="btn bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// =================================================================================
// COMPONENTE PRINCIPAL
// =================================================================================
export default function DashboardProfissional({ session, Card, NotificacaoBar }) {
  const [aba, setAba] = useState('clientes');
  
  // Usa o hook customizado para buscar os dados
  const { data, loading, error, refreshData } = useProfissionalData();
  const { clientes, documentos } = data;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-teal-600">Carregando dados do painel profissional...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-lg text-red-600">Erro ao carregar dados: {error}</p>
        <button onClick={refreshData} className="ml-4 text-blue-600 hover:underline">Tentar Novamente</button>
      </div>
    );
  }

  // Conteúdo de cada aba
  const renderConteudo = () => {
    switch (aba) {
      case 'clientes':
        return <ClientesProfissional clientes={clientes} documentosPendentes={documentos} Card={Card} />;
      case 'documentos':
        return <DocumentosProfissional documentos={documentos} refreshData={refreshData} />;
      case 'perfil':
        return <h2 className="text-2xl font-semibold text-gray-800">Meu Perfil (Configurações de conta)</h2>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar de Navegação */}
      <div className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="text-2xl font-bold text-teal-600">TopMEI - Profissional</div>
          <nav className="space-y-2">
            <Aba titulo="Clientes" icone={Users} ativa={aba === 'clientes'} onClick={() => setAba('clientes')} />
            <Aba titulo="Documentos" icone={FileCheck} ativa={aba === 'documentos'} onClick={() => setAba('documentos')} />
            <Aba titulo="Perfil" icone={Settings} ativa={aba === 'perfil'} onClick={() => setAba('perfil')} />
          </nav>
        </div>
        
        {/* Rodapé da Sidebar */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="truncate">{session?.user?.email}</span>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-500 transition-colors" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-end items-center mb-8">
          <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors" title="Notificações">
            <Bell size={24} />
          </button>
        </header>
        
        {renderConteudo()}
      </main>
    </div>
  );
}

