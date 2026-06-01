import { useEffect, useState } from 'react';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';
import { normalizePagination } from '@/app/functions/mascotasUtils.js';

export function usePetDiagnoses(petId) {
  const [diagnoses, setDiagnoses] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(normalizePagination());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDiagnoses = async (nextPage = page) => {
    if (!petId) {
      setDiagnoses([]);
      setPagination(normalizePagination());
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await pawlyticsApi.getDetailedAnalyses({
        page: nextPage,
        limit: 5,
        filters: {
          petId,
          state: true,
          hasPersonResponse: true,
        },
      });
      const completeDiagnoses = Array.isArray(response?.data) ? response.data : [];

      setDiagnoses(completeDiagnoses);
      setPagination(normalizePagination(response, completeDiagnoses.length));
    } catch {
      setDiagnoses([]);
      setPagination(normalizePagination());
      setErrorMessage('No se pudieron cargar los diagnosticos revisados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiagnoses(page);
  }, [petId, page]);

  return {
    diagnoses,
    page,
    setPage,
    pagination,
    isLoading,
    errorMessage,
    loadDiagnoses,
  };
}
