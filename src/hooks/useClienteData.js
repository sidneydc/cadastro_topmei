import { useState, useEffect } from 'react';
import { getClienteData } from '../services/clienteService';

/**
 * Hook customizado para buscar e gerenciar o estado dos dados do cliente.
 * @param {Object} session A sessão do usuário logado.
 * @returns {Object} { data, loading, error, refreshData }
 */
export function useClienteData(session) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = session?.user?.id;

  const fetchData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clienteData = await getClienteData(userId);
      setData(clienteData);
    } catch (err) {
      console.error("Erro no useClienteData:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]); // Dependência do userId para recarregar se o usuário mudar

  // Função para recarregar os dados manualmente (útil após um upload ou atualização)
  const refreshData = () => {
    fetchData();
  };

  return { data, loading, error, refreshData };
}

