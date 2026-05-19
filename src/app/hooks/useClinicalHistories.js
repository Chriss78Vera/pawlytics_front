import { useEffect, useMemo, useState } from 'react';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';
import { normalizeMascotas, normalizePagination } from '@/app/pages/Mascotas/shared/mascotasUtils.js';
import clinicalHistoryOptions from '@/app/assets/data/clinicalHistoryOptions.json';

export function useClinicalHistories({ user, selectedPet, initialView }) {
  const canCreate = user.role === 'veterinario';
  const [view, setView] = useState(canCreate && initialView === 'create' ? 'create' : 'list');
  const [histories, setHistories] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState(clinicalHistoryOptions.initialFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(normalizePagination());
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const petById = useMemo(() => {
    return Object.fromEntries(pets.map((pet) => [String(pet.id), pet]));
  }, [pets]);

  const loadPets = async () => {
    const response = user.role === 'cliente'
      ? await pawlyticsApi.getMascotasByUserData(user.userDataId, { page: 1, limit: 50 })
      : await pawlyticsApi.getMascotas({ page: 1, limit: 50 });
    setPets(normalizeMascotas(response));
  };

  const loadHistories = async (nextPage = page) => {
    setIsLoading(true);
    setMessage('');

    try {
      const roleFilters = user.role === 'cliente' ? { userDataId: user.userDataId } : {};
      const response = selectedPet
        ? await pawlyticsApi.getClinicalHistoryByPet(selectedPet.id, { page: nextPage, limit: 5, filters })
        : await pawlyticsApi.getClinicalHistory({ page: nextPage, limit: 5, filters: { ...filters, ...roleFilters } });

      setHistories(Array.isArray(response?.data) ? response.data : []);
      setPagination(normalizePagination(response));
    } catch {
      setHistories([]);
      setPagination(normalizePagination());
      setMessage('No se pudo cargar el historial clinico.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carga el catalogo de mascotas disponible para el rol actual.
  useEffect(() => {
    loadPets().catch(() => setPets([]));
  }, [user.role, user.userDataId]);

  // Recalcula la vista cuando el dashboard cambia entre listado, creacion o mascota seleccionada.
  useEffect(() => {
    setView(canCreate && initialView === 'create' ? 'create' : 'list');
    setSelectedHistory(null);
    setPage(1);
  }, [initialView, selectedPet?.id, canCreate]);

  // Mantiene el listado sincronizado con paginacion y alcance de mascota.
  useEffect(() => {
    if (view !== 'list') {
      return;
    }

    loadHistories();
  }, [page, selectedPet?.id, view]);

  const applyFilters = () => {
    setPage(1);
    loadHistories(1);
  };

  const handleCreated = (created) => {
    setView('list');
    setPage(1);
    setHistories((current) => [created, ...current].slice(0, 5));
    setMessage('Historia clinica registrada correctamente.');
  };

  const showDetail = (history) => {
    setSelectedHistory(history);
    setView('detail');
  };

  const backToList = () => {
    setSelectedHistory(null);
    setView('list');
  };

  return {
    canCreate,
    view,
    setView,
    histories,
    selectedHistory,
    pets,
    petById,
    filters,
    setFilters,
    page,
    setPage,
    pagination,
    isLoading,
    message,
    loadHistories,
    applyFilters,
    handleCreated,
    showDetail,
    backToList,
  };
}
