import dashboardOptions from '@/app/assets/data/dashboardOptions.json';

export const dashboardPermissions = {
  seeAi: (role) => role === 'admin' || role === 'veterinario',
  managePets: (role) => role === 'admin',
  manageHistory: (role) => role === 'veterinario',
};

// Une la respuesta del dashboard con defaults para evitar undefined en graficas.
export function mergeDashboardSummary(response) {
  return {
    ...dashboardOptions.emptySummary,
    ...response,
    metrics: {
      ...dashboardOptions.emptySummary.metrics,
      ...(response?.metrics ?? {}),
    },
  };
}

// Muestra placeholders mientras cargan las metricas.
export function formatMetricValue(value, isLoading) {
  if (isLoading) {
    return '...';
  }

  return String(value ?? 0);
}
