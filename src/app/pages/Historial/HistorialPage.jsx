import { AlertCircle, ArrowLeft, Plus } from 'lucide-react';
import { HistorialProvider } from '@/app/context/HistorialContext.jsx';
import { useClinicalHistories } from '@/app/hooks/useClinicalHistories.js';
import { ClinicalHistoryForm } from './components/ClinicalHistoryForm.jsx';
import { HistoryDetail } from './components/HistoryDetail.jsx';
import { HistoryFilters } from './components/HistoryFilters.jsx';
import { HistoryTable } from './components/HistoryTable.jsx';

export function HistorialPage({ user, selectedPet, selectedPetId, initialView = 'list' }) {
  return (
    <HistorialProvider user={user} selectedPet={selectedPet}>
      <HistorialPageContent user={user} selectedPet={selectedPet} selectedPetId={selectedPetId} initialView={initialView} />
    </HistorialProvider>
  );
}

function HistorialPageContent({ user, selectedPet, selectedPetId, initialView }) {
  const {
    canCreate,
    view,
    setView,
    histories,
    selectedHistory,
    pets,
    petById,
    filters,
    setFilters,
    setPage,
    pagination,
    isLoading,
    message,
    loadHistories,
    applyFilters,
    handleCreated,
    showDetail,
    backToList,
  } = useClinicalHistories({ user, selectedPet, selectedPetId, initialView });
  const displayPet = selectedPet?.name
    ? selectedPet
    : petById[String(selectedPetId ?? selectedPet?.id)] ?? selectedPet;
  const isPetScoped = Boolean(selectedPet || selectedPetId);

  if (view === 'create' && canCreate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#462255]">Crear historial clinico</h1>
            <p className="text-[#313B72]">Registra la informacion medica de la mascota seleccionada.</p>
          </div>
          <button
            onClick={() => setView('list')}
            className="flex items-center gap-2 rounded-xl bg-[#313B72] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#462255]"
          >
            <ArrowLeft className="h-5 w-5" />
            Regresar
          </button>
        </div>

        <ClinicalHistoryForm
          pets={pets}
          selectedPet={displayPet}
          onCancel={() => setView('list')}
          onCreated={handleCreated}
        />
      </div>
    );
  }

  if (view === 'detail' && selectedHistory) {
    return (
      <HistoryDetail
        history={selectedHistory}
        pet={petById[String(selectedHistory.id_mascota)]}
        onBack={backToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Historial clinico</h1>
          <p className="text-[#313B72]">
            {isPetScoped
              ? `Historiales registrados para ${displayPet?.name ?? `mascota #${selectedPetId ?? selectedPet.id}`}.`
              : user.role === 'cliente'
              ? 'Consulta el historial de tus mascotas.'
              : 'Consulta y filtra los historiales registrados.'}
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 rounded-xl bg-[#62A87C] px-5 py-3 font-bold text-[#462255]"
          >
            <Plus className="h-5 w-5" />
            Nuevo historial
          </button>
        )}
      </div>

      {message && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#7EE081]/40 bg-[#C3F3C0]/30 px-5 py-4 text-[#313B72]">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{message}</span>
        </div>
      )}

      <HistoryFilters
        filters={filters}
        onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
        onSubmit={applyFilters}
        showOwner={user.role !== 'cliente'}
        isPetScoped={isPetScoped}
        selectedPet={displayPet}
      />

      <HistoryTable
        histories={histories}
        petById={petById}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onRefresh={() => loadHistories()}
        onViewDetail={showDetail}
      />
    </div>
  );
}
