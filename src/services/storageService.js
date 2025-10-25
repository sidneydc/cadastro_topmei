import { supabase } from '../config/supabaseClient';

// Nome do bucket que você configurou no Supabase Storage
const BUCKET_NAME = 'documentos-clientes'; // Substitua pelo nome real do seu bucket

/**
 * Realiza o upload de um arquivo para o Supabase Storage e atualiza o registro do documento no banco de dados.
 * @param {File} file O objeto File a ser enviado.
 * @param {string} id_cadastro O ID do cliente.
 * @param {string} tipo_documento O tipo de documento (ex: "CNPJ", "RG").
 * @param {string} id_documento O ID do registro na tabela cadastros_documentos a ser atualizado.
 * @returns {Promise<Object>} O registro do documento atualizado.
 */
export async function uploadDocumento(file, id_cadastro, tipo_documento, id_documento) {
  if (!file) {
    throw new Error("Nenhum arquivo selecionado.");
  }

  // 1. Definir o caminho de destino no Storage
  // Ex: documentos-clientes/id_cadastro/tipo_documento_timestamp.pdf
  const filePath = `${id_cadastro}/${tipo_documento}_${Date.now()}.${file.name.split('.').pop()}`;

  // 2. Upload do arquivo
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Permite substituir um arquivo com o mesmo nome
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Erro no upload do arquivo.");
  }

  // 3. Obter a URL pública do arquivo (se necessário, mas o RLS deve proteger)
  // const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  // 4. Atualizar o registro na tabela cadastros_documentos
  // O status deve mudar para 'pendente_analise' após o envio
  const { data: updateData, error: updateError } = await supabase
    .from('cadastros_documentos')
    .update({
      url_documento: uploadData.path, // Salva o caminho do arquivo no banco
      status_documento: 'pendente_analise',
      data_envio: new Date().toISOString(),
      observacao: null, // Limpa observação anterior de rejeição
    })
    .eq('id_documento', id_documento)
    .select()
    .single();

  if (updateError) {
    // Se o update falhar, idealmente, você deveria tentar deletar o arquivo do storage
    console.error("Erro ao atualizar o registro do documento no BD:", updateError);
    throw new Error("Upload realizado, mas falha ao atualizar o banco de dados.");
  }

  return updateData;
}

