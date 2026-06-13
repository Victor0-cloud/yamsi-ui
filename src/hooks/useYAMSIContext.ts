import { useState, useCallback } from 'react';
import { YAMSIContext } from '../lib/yamsi/config';
import { getAPI } from '../lib/yamsi/api';

export function useYAMSIContext() {
  const [context, setContext] = useState<YAMSIContext>({
    tenant_id: '00000000-0000-0000-0000-000000000001',
    user_id: 'victor',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContext = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const api = getAPI();
      const response = await api.getContext();
      if (response.found) {
        setContext(response.context);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch context');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContext = useCallback(async (newContext: Partial<YAMSIContext>) => {
    setLoading(true);
    setError(null);
    try {
      const api = getAPI();
      await api.setContext(newContext);
      setContext((prev) => ({ ...prev, ...newContext }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update context');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    context,
    loading,
    error,
    fetchContext,
    updateContext,
  };
}
