import { useEffect, useState } from 'react';
import { repository } from '../repository/index.js';

function useSubscription(methodName) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    try {
      const unsubscribe = repository[methodName](setData, setError);
      return typeof unsubscribe === 'function' ? unsubscribe : undefined;
    } catch (err) {
      setError(err);
      return undefined;
    }
  }, [methodName]);

  return { data, error };
}

export function useReports() { return useSubscription('subscribeReports'); }
export function useIncidents() { return useSubscription('subscribeIncidents'); }
export function useAudit() { return useSubscription('subscribeAudit'); }
