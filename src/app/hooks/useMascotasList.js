import { useEffect, useState } from 'react';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';
import mascotasOptions from '@/app/assets/data/mascotasOptions.json';
import { normalizeMascotas, normalizePagination } from '@/app/functions/mascotasUtils.js';

export function useMascotasList({ mode, userDataId }) {
  const [mascotas, setMascotas] = useState([]);
  const [filters, setFilters] = useState(mascotasOptions.initialFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(normalizePagination());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadMascotas = async (nextPage = page) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const request = mode === 'client'
        ? pawlyticsApi.getMascotasByUserData(userDataId, { page: nextPage, limit: 5, filters })
        : pawlyticsApi.getMascotas({ page: nextPage, limit: 5, filters });
      const response = await request;
      const items = normalizeMascotas(response);
      setMascotas(items);
      setPagination(normalizePagination(response, items.length));
    } catch {
      setMascotas(mascotasOptions.fallbackMascotas);
      setPagination(normalizePagination(null, mascotasOptions.fallbackMascotas.length));
      setErrorMessage('No se pudo cargar la informacion actualizada.');
    } finally {
      setIsLoading(false);
    }
  };

  // Recarga la lista cuando cambia la pagina o el propietario en vista cliente.
  useEffect(() => {
    loadMascotas();
  }, [userDataId, page]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      ...(field === 'typeId' ? { breedId: '' } : {}),
    }));
  };

  const applyFilters = () => {
    setPage(1);
    loadMascotas(1);
  };

  const prependMascota = (createdMascota) => {
    const createdItems = normalizeMascotas(createdMascota);

    if (createdItems.length) {
      setMascotas((current) => [...createdItems, ...current].slice(0, 5));
    } else {
      loadMascotas(1);
    }

    setPage(1);
  };

  return {
    mascotas,
    filters,
    updateFilter,
    page,
    setPage,
    pagination,
    isLoading,
    errorMessage,
    loadMascotas,
    applyFilters,
    prependMascota,
  };
}
