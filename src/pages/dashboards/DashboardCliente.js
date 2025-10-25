import React, { useState } from 'react';
import { LogOut, Bell, LayoutDashboard, FileText, DollarSign, User, Settings, CheckCircle, XCircle, Clock, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../../config/supabaseClient';
import { useClienteData } from '../../hooks/useClienteData';

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
// SUBCOMPONENTES DO DASHBOARD
// =================================================================================

// 1. Aba Dashboard - Visão Geral
const DashboardVisaoGeral = ({ cadastro, documentos, contratos }) => {
  const statusCadastro = cadastro?.status_cadastro || 'Não Iniciado';
  const totalDocumentos = documentos?.length || 0;
  const documentosPendentes = documentos?.filter(d => d.status_documento === 'pendente_envio').length || 0;
  const contratosAtivos = contratos?.filter(c => c.status_contrato === 'ativo').length || 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Visão Geral</h2>
      
      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card titulo="Status Cadastro" valor={statusCadastro} cor={statusCadastro === 'aprovado' ? 'green' : statusCadastro === 'pendente_analise' ? 'yellow' : 'red'} />
        <Card titulo="Documentos Enviados" valor={`${totalDocumentos - documentosPendentes} / ${totalDocumentos}`} cor="blue" />
        <Card titulo="Contratos Ativos" valor={contratosAtivos} cor="teal" />
      </div>

      {/* Próximos Passos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Próximos Passos</h3>
        <ul className="space-y-3">
          {documentosPendentes > 0 && (
            <li className="flex items-center space-x-3 text-red-600">
              <XCircle size={20} />
              <span>Você tem **{documentosPendentes} documento(s)** pendente(s) de envio. Acesse a aba "Documentos".</span>
            </li>
          )}
          {statusCadastro !== 'aprovado' && statusCadastro !== 'pendente_analise' && (
            <li className="flex items-center space-x-3 text-yellow-600">
              <Clock size={20} />
              <span>Seu cadastro ainda não foi finalizado. Preencha todos os dados na aba "Meu Cadastro".</span>
            </li>
          )}
          {statusCadastro === 'pendente_analise' && (
            <li className="flex items-center space-x-3 text-blue-600">
              <Clock size={20} />
              <span>Seu cadastro e documentos estão **em análise** pelo seu contador.</span>
            </li>
          )}
          {statusCadastro === 'aprovado' && (
            <li className="flex items-center space-x-3 text-green-600">
              <CheckCircle size={20} />
              <span>Parabéns! Seu cadastro foi **aprovado**.</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

// 2. Aba Documentos
import FileUpload from '../../components/ui/FileUpload';
import { uploadDocumento } from '../../services/storageService';
const DocumentosCliente = ({ documentos, id_cadastro, refreshData }) => {
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleUpload = async (doc) => {
    if (!fileToUpload) return;

    setUploadingId(doc.id_documento);
    setUploadError(null);

    try {
      await uploadDocumento(fileToUpload, id_cadastro, doc.tipo_documento, doc.id_documento);
      
      // Limpa o estado e recarrega os dados do cliente
      setFileToUpload(null);
      refreshData();
    } catch (error) {
      console.error("Erro ao realizar upload:", error);
      setUploadError(error.message);
    } finally {
      setUploadingId(null);
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'aprovado': return <CheckCircle size={20} className="text-green-500" />;
      case 'rejeitado': return <XCircle size={20} className="text-red-500" />;
      case 'pendente_analise': return <Clock size={20} className="text-yellow-500" />;
      case 'pendente_envio': return <Upload size={20} className="text-blue-500" />;
      default: return <Clock size={20} className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'rejeitado': return 'Rejeitado';
      case 'pendente_analise': return 'Em Análise';
      case 'pendente_envio': return 'Pendente de Envio';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Documentos</h2>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        {uploadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <p className="font-bold">Erro de Upload:</p>
            <p className="text-sm">{uploadError}</p>
          </div>
        )}
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documentos?.map((doc) => (
              <tr key={doc.id_documento}>
                {/* Modal de Upload para cada documento (Usando estado para visibilidade) */}
                {/* Nota: Para um projeto real, um componente Modal mais robusto seria ideal */}
                {uploadingId === doc.id_documento && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                      <h3 className="font-bold text-lg">Enviando Documento...</h3>
                      <div className="py-4 flex items-center justify-center space-x-3 text-teal-600">
                        <Loader2 className="animate-spin" size={24} />
                        <p>Aguarde, o arquivo está sendo enviado.</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Fim do Modal de Loading */}
                
                {/* Modal de Seleção de Arquivo */}
                <div 
                  id={`modal-upload-${doc.id_documento}`} 
                  className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 hidden justify-center items-center"
                >
                  <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h3 className="font-bold text-lg">Enviar Documento: {doc.tipo_documento}</h3>
                    <p className="py-4">Selecione o arquivo para enviar. O arquivo será enviado para análise do seu contador.</p>
                    
                    <FileUpload 
                      onFileSelect={setFileToUpload}
                      acceptedFormats=".pdf" // Assumindo que você só aceita PDF
                    />
                    
                    <div className="flex justify-end space-x-3 mt-4">
                      <button 
                        className="btn bg-gray-300 text-gray-800 hover:bg-gray-400"
                        onClick={() => document.getElementById(`modal-upload-${doc.id_documento}`).classList.add('hidden')}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="btn bg-teal-600 text-white hover:bg-teal-700"
                        onClick={() => {
                          handleUpload(doc);
                          document.getElementById(`modal-upload-${doc.id_documento}`).classList.add('hidden');
                        }}
                        disabled={!fileToUpload || uploadingId === doc.id_documento}
                      >
                        <Upload size={20} />
                        Confirmar Envio
                      </button>
                    </div>
                  </div>
                </div>
                {/* Fim do Modal de Seleção de Arquivo */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.tipo_documento}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center space-x-2">
                    {getStatusIcon(doc.status_documento)}
                    <span>{getStatusText(doc.status_documento)}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.observacao || 'Nenhuma'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {doc.status_documento !== 'aprovado' && (
                    <button
                      onClick={() => document.getElementById(`modal-upload-${doc.id_documento}`).classList.remove('hidden')}
                      className="text-teal-600 hover:text-teal-900 flex items-center space-x-1"
                    >
                      <Upload size={16} />
                      <span>{doc.status_documento === 'pendente_envio' ? 'Enviar' : 'Reenviar'}</span>
                    </button>
                  )}
                  {/* Botão de visualização (se houver url_documento) */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. Aba Meu Cadastro (Simplificada)
const MeuCadastroCliente = ({ cadastro, refreshData }) => {
  // NOTA: A implementação completa de edição de formulário será mais complexa.
  // Por enquanto, apenas exibimos os dados.
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dados Cadastrais</h2>
      <div className="bg-white p-6 rounded-lg shadow grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-2">Informações Básicas</h3>
        </div>
        <p><strong>CNPJ:</strong> {cadastro?.cnpj}</p>
        <p><strong>Razão Social:</strong> {cadastro?.razao_social}</p>
        <p><strong>Nome Fantasia:</strong> {cadastro?.nome_fantasia}</p>
        <p><strong>Telefone:</strong> {cadastro?.telefone}</p>
        <p><strong>Email:</strong> {cadastro?.email_contato}</p>
        <p><strong>Data de Abertura:</strong> {new Date(cadastro?.data_abertura).toLocaleDateString()}</p>
      </div>
      <div className="flex justify-end">
        <button className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700">Editar Dados</button>
      </div>
    </div>
  );
};

// 4. Aba Serviços (Simplificada)
const ServicosCliente = ({ contratos }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Serviços Contratados</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <ul className="divide-y divide-gray-200">
          {contratos?.map((contrato) => (
            <li key={contrato.id_contrato} className="py-4">
              <p className="text-lg font-semibold text-teal-600">{contrato.nome_servico}</p>
              <p className="text-sm text-gray-500">Status: {contrato.status_contrato}</p>
              <p className="text-sm text-gray-500">Valor Mensal: R$ {contrato.valor_mensal}</p>
              <p className="text-sm text-gray-500">Data de Início: {new Date(contrato.data_inicio).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


// =================================================================================
// COMPONENTE PRINCIPAL
// =================================================================================
export default function DashboardCliente({ session, Card, NotificacaoBar }) {
  const [aba, setAba] = useState('dashboard');
  
  // Usa o hook customizado para buscar os dados
  const { data, loading, error, refreshData } = useClienteData(session);
  const { cadastro, documentos, contratos } = data || {};

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-teal-600">Carregando dados do cliente...</p>
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
      case 'dashboard':
        return <DashboardVisaoGeral cadastro={cadastro} documentos={documentos} contratos={contratos} Card={Card} NotificacaoBar={NotificacaoBar} />;
      case 'cadastro':
        return <MeuCadastroCliente cadastro={cadastro} refreshData={refreshData} />;
      case 'documentos':
        return <DocumentosCliente documentos={documentos} id_cadastro={cadastro?.id_cadastro} refreshData={refreshData} />;
      case 'servicos':
        return <ServicosCliente contratos={contratos} />;
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
          <div className="text-2xl font-bold text-teal-600">TopMEI</div>
          <nav className="space-y-2">
            <Aba titulo="Dashboard" icone={LayoutDashboard} ativa={aba === 'dashboard'} onClick={() => setAba('dashboard')} />
            <Aba titulo="Meu Cadastro" icone={User} ativa={aba === 'cadastro'} onClick={() => setAba('cadastro')} />
            <Aba titulo="Documentos" icone={FileText} ativa={aba === 'documentos'} onClick={() => setAba('documentos')} />
            <Aba titulo="Serviços" icone={DollarSign} ativa={aba === 'servicos'} onClick={() => setAba('servicos')} />
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

