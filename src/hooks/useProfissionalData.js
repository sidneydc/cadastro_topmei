import { useState, useEffect } from 'react';
import { getListaClientes, getDocumentosPendentes } from '../services/profissionalService';

/**
 * Hook customizado para buscar e gerenciar o estado dos dados do profissional (contador).
 * @returns {Object} { data, loading, error, refreshData }
 */
export function useProfissionalData() {
  const [data, setData] = useState({ clientes: [], documentos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const clientes = await getListaClientes();
      const documentos = await getDocumentosPendentes();
      
      setData({ clientes, documentos });
    } catch (err) {
      console.error("Erro no useProfissionalData:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Executa apenas na montagem do componente

  // Função para recarregar os dados manualmente
  const refreshData = () => {
    fetchData();
  };

  return { data, loading, error, refreshData };
}

