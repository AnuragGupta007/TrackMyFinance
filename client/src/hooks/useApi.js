import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Generic hook for API calls with loading/error state management.
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, onError, successMessage, showError = true } = options;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      if (successMessage) toast.success(successMessage);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const message = err.message || 'Something went wrong';
      setError(message);
      if (showError) toast.error(message);
      if (onError) onError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};

export default useApi;
