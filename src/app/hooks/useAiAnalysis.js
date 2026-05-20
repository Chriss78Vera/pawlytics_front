import { useEffect, useMemo, useState } from 'react';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';
import { normalizePagination } from '@/app/pages/Mascotas/shared/mascotasUtils.js';
import { buildAiRequest, roleIdByName } from '@/app/functions/aiAnalysisUtils.js';

export function useAiAnalysis(user) {
  const [histories, setHistories] = useState([]);
  const [pagination, setPagination] = useState(normalizePagination());
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const filters = useMemo(() => (
    user.role === 'cliente' ? { userDataId: user.userDataId } : {}
  ), [user.role, user.userDataId]);

  const loadHistories = async (page = 1) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await pawlyticsApi.getClinicalHistory({ page, limit: 8, filters });
      setHistories(Array.isArray(response?.data) ? response.data : []);
      setPagination(normalizePagination(response));
    } catch {
      setHistories([]);
      setPagination(normalizePagination());
      setError('No se pudieron cargar los historiales medicos actuales.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistories();
  }, [filters]);

  const waitForAnalysis = async (logId) => {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const log = await pawlyticsApi.getAiLogById(logId);

      if (log.status === 'completed' && log.detailedAnalysisId) {
        return pawlyticsApi.getDetailedAnalysisById(log.detailedAnalysisId);
      }

      if (log.status === 'failed') {
        throw new Error(log.error || 'La IA no pudo completar el analisis.');
      }
    }

    throw new Error('La IA sigue procesando la solicitud. Intenta consultar nuevamente en unos segundos.');
  };

  const findExistingAnalysis = async (petId) => {
    const response = await pawlyticsApi.getDetailedAnalyses({
      page: 1,
      limit: 1,
      filters: {
        petId,
      },
    });

    return Array.isArray(response?.data) && response.data.length ? response.data[0] : null;
  };

  const analyzeHistory = async (history) => {
    setSelectedHistory(history);
    setAnalysis(null);
    setReviewText('');
    setMessage('');
    setError('');
    setIsAnalyzing(true);

    try {
      const existingAnalysis = await findExistingAnalysis(history.id_mascota);

      if (existingAnalysis) {
        setAnalysis(existingAnalysis);
        setReviewText(existingAnalysis.person_response || existingAnalysis.IA_RESPONSE || '');
        setMessage('Se encontro un diagnostico existente para esta mascota. Puedes actualizarlo sin reenviar la solicitud a la IA.');
        return;
      }

      const response = await pawlyticsApi.createAiAnalysis({
        petId: history.id_mascota,
        requesterUserId: user.userId,
        requesterRoleId: roleIdByName[user.role],
        request: buildAiRequest(history),
      });
      const detailedAnalysis = response.detailedAnalysis ?? await waitForAnalysis(response.id);

      setAnalysis(detailedAnalysis);
      setReviewText(detailedAnalysis.person_response || detailedAnalysis.IA_RESPONSE || '');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'No se pudo generar el analisis de IA.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveReview = async () => {
    if (!analysis?.id || !reviewText.trim()) {
      setError('Escribe la respuesta revisada por el veterinario antes de guardar.');
      return;
    }

    setMessage('');
    setError('');
    setIsSavingReview(true);

    try {
      const updated = await pawlyticsApi.updateDetailedAnalysis(analysis.id, {
        person_response: reviewText,
        state: true,
      });
      setAnalysis(updated);
      setMessage('Analisis revisado y guardado en Mongo correctamente.');
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo guardar la revision del veterinario.');
    } finally {
      setIsSavingReview(false);
    }
  };

  return {
    histories,
    pagination,
    isLoading,
    isAnalyzing,
    isSavingReview,
    selectedHistory,
    analysis,
    reviewText,
    message,
    error,
    setAnalysis,
    setReviewText,
    loadHistories,
    analyzeHistory,
    saveReview,
  };
}
