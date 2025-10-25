import { supabase } from '../config/supabaseClient';

/**
 * Busca a lista de todos os clientes com seus status de cadastro.
 * @returns {Promise<Array>} Lista de clientes
 */
export async function getListaClientes() {
  const { data, error } = await supabase
    .from('cadastros_clientes')
    .select('id_cadastro, razao_social, cnpj, status_cadastro, data_abertura');

  if (error) {
    throw new Error(error.message || "Erro ao buscar a lista de clientes.");
  }

  return data;
}

/**
 * Busca todos os documentos pendentes de análise.
 * @returns {Promise<Array>} Lista de documentos
 */
export async function getDocumentosPendentes() {
  // Busca documentos que estão 'pendente_analise' e traz os dados do cliente junto (JOIN)
  const { data, error } = await supabase
    .from('cadastros_documentos')
    .select(`
      *,
      cadastros_clientes (razao_social, cnpj)
    `)
    .eq('status_documento', 'pendente_analise');

  if (error) {
    throw new Error(error.message || "Erro ao buscar documentos pendentes.");
  }

  return data;
}

/**
 * Atualiza o status de um documento (Aprovar ou Rejeitar).
 * @param {string} id_documento O ID do documento.
 * @param {('aprovado'|'rejeitado')} novoStatus O novo status.
 * @param {string} observacao A observação (obrigatória em caso de rejeição).
 * @returns {Promise<Object>} O documento atualizado.
 */
export async function updateDocumentoStatus(id_documento, novoStatus, observacao = null) {
  const { data, error } = await supabase
    .from('cadastros_documentos')
    .update({
      status_documento: novoStatus,
      observacao: observacao,
      data_analise: new Date().toISOString(),
    })
    .eq('id_documento', id_documento)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || `Erro ao ${novoStatus === 'aprovado' ? 'aprovar' : 'rejeitar'} o documento.`);
  }

  return data;
}

