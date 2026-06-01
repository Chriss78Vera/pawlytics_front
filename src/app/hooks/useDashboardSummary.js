import { useEffect, useState } from 'react';
import dashboardOptions from '@/app/assets/data/dashboardOptions.json';
import { mergeDashboardSummary } from '@/app/functions/dashboardUtils.js';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';

export function useDashboardSummary(user) {
  const [summary, setSummary] = useState(dashboardOptions.emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Actualiza las metricas del inicio cuando cambia el usuario o el rol.
  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setErrorMessage('');

    pawlyticsApi.getDashboardSummary({ role: user.role, userDataId: user.userDataId })
      .then((response) => {
        if (!isActive) return;
        setSummary(mergeDashboardSummary(response));
      })
      .catch(() => {
        if (!isActive) return;
        setSummary(dashboardOptions.emptySummary);
        setErrorMessage('No se pudieron cargar las metricas actualizadas.');
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [user.role, user.userDataId]);

  return {
    summary,
    isLoading,
    errorMessage,
  };
}
