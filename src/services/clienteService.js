import { supabase } from '../config/supabaseClient';

/**
 * Busca todos os dados relevantes para o Dashboard do Cliente:
 * - Dados do cadastro (tabela cadastros_clientes)
 * - Lista de documentos (tabela cadastros_documentos)
 * - Lista de serviços/contratos (tabela contratos)
 * @param {string} userId O ID do usuário logado (auth.users.id)
 * @returns {Promise<Object>} Objeto contendo cadastro, documentos e contratos
 */
export async function getClienteData(userId) {
  // 1. Buscar o perfil do usuário para encontrar o id_cadastro
  // NOTA: Esta etapa assume a existência de uma tabela 'profiles' para mapear o userId do Auth
  // para o id_cadastro da tabela cadastros_clientes.
  // Se esta tabela não existir, a lógica deve ser ajustada.
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id_cadastro')
    .eq('id', userId)
    .single();

  if (profileError || !profileData) {
    throw new Error(profileError?.message || "Perfil de usuário não encontrado. Verifique a tabela 'profiles'.");
  }

  const id_cadastro = profileData.id_cadastro;

  // 2. Buscar os dados do cadastro do cliente
  const { data: cadastroData, error: cadastroError } = await supabase
    .from('cadastros_clientes')
    .select('*')
    .eq('id_cadastro', id_cadastro)
    .single();

  if (cadastroError) {
    throw new Error(cadastroError.message || "Erro ao buscar dados de cadastro.");
  }

  // 3. Buscar os documentos associados
  const { data: documentosData, error: documentosError } = await supabase
    .from('cadastros_documentos')
    .select('*')
    .eq('id_cadastro', id_cadastro);

  if (documentosError) {
    throw new Error(documentosError.message || "Erro ao buscar documentos.");
  }
  
  // 4. Buscar os contratos/serviços
  const { data: contratosData, error: contratosError } = await supabase
    .from('contratos')
    .select('*')
    .eq('id_cadastro', id_cadastro);

  if (contratosError) {
    throw new Error(contratosError.message || "Erro ao buscar contratos.");
  }

  return {
    cadastro: cadastroData,
    documentos: documentosData,
    contratos: contratosData,
  };
}

/**
 * Atualiza os dados básicos do cadastro do cliente.
 * @param {string} id_cadastro O ID do cadastro a ser atualizado.
 * @param {Object} updates Os campos a serem atualizados.
 * @returns {Promise<Object>} O objeto atualizado.
 */
export async function updateCadastroBasico(id_cadastro, updates) {
  const { data, error } = await supabase
    .from('cadastros_clientes')
    .update(updates)
    .eq('id_cadastro', id_cadastro)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao atualizar o cadastro.");
  }

  return data;
}

// Outras funções de serviço (upload, exclusão, etc.) podem ser adicionadas aqui.

