import { useEffect, useState } from 'react';
import { repository } from '../repository/index.js';

function useSubscription(methodName) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);
    setLoading(true);
    try {
      const unsubscribe = repository[methodName](nextData => {
        setData(nextData);
        setLoading(repository.backendMode === 'loading');
      }, err => {
        setError(err);
        setLoading(false);
      });
      return typeof unsubscribe === 'function' ? unsubscribe : undefined;
    } catch (err) {
      setError(err);
      setLoading(false);
      return undefined;
    }
  }, [methodName]);

  const retry = async () => {
    setError(null);
    setLoading(true);
    try {
      await repository.refresh();
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { data, error, loading, retry };
}

export function useReports() { return useSubscription('subscribeReports'); }
export function useIncidents() { return useSubscription('subscribeIncidents'); }
export function useAudit() { return useSubscription('subscribeAudit'); }
