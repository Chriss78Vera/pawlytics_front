import { useState } from 'react';
import { AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { MascotaForm } from '@/app/pages/Mascotas/components/MascotaForm';
import { useMascotasList } from '@/app/hooks/useMascotasList.js';
import { MascotasFilters } from '@/app/pages/Mascotas/shared/MascotasFilters.jsx';
import { MascotasTable } from '@/app/pages/Mascotas/shared/MascotasTable.jsx';

export function ClienteMascotasPage({ user, initialView = 'list', onHistory }) {
  const [view, setView] = useState(initialView);
  const {
    mascotas,
    filters,
    updateFilter,
    setPage,
    pagination,
    isLoading,
    errorMessage,
    loadMascotas,
    applyFilters,
    prependMascota,
  } = useMascotasList({ mode: 'client', userDataId: user.userDataId });

  const handleMascotaCreated = (createdMascota) => {
    prependMascota(createdMascota);
    setView('list');
  };

  if (view === 'create') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Agregar mascota</h1>
          <p className="text-[#313B72]">Registra una nueva mascota para mantener su salud siempre al dia.</p>
        </div>
        <MascotaForm
          userDataId={user.userDataId}
          onCancel={() => setView('list')}
          onCreated={handleMascotaCreated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Mascotas</h1>
          <p className="text-[#313B72]">Estas son tus mascotas registradas.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadMascotas()}
            className="px-5 py-3 bg-[#313B72] text-white rounded-xl font-semibold hover:bg-[#462255] transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={() => setView('create')}
            className="px-5 py-3 bg-gradient-to-r from-[#7EE081] to-[#62A87C] text-[#462255] rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar mascota
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </div>
      )}

      <MascotasFilters filters={filters} onChange={updateFilter} onSubmit={applyFilters} />

      <MascotasTable
        mascotas={mascotas}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onHistory={onHistory}
      />
    </div>
  );
}
