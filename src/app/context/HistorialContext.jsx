import { createContext, useContext, useMemo } from 'react';

const HistorialContext = createContext(null);

export function HistorialProvider({ user, selectedPet, children }) {
  const value = useMemo(() => ({
    user,
    selectedPet,
    canCreateHistory: user.role === 'veterinario',
    canViewClinicalRecords: ['admin', 'cliente', 'veterinario'].includes(user.role),
  }), [user, selectedPet]);

  return (
    <HistorialContext.Provider value={value}>
      {children}
    </HistorialContext.Provider>
  );
}

export function useHistorialContext() {
  const context = useContext(HistorialContext);

  if (!context) {
    throw new Error('useHistorialContext debe usarse dentro de HistorialProvider');
  }

  return context;
}
