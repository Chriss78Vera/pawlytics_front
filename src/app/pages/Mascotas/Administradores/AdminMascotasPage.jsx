import { AlertCircle, RefreshCw } from 'lucide-react';
import { useMascotasList } from '@/app/hooks/useMascotasList.js';
import { MascotasFilters } from '@/app/pages/Mascotas/shared/MascotasFilters.jsx';
import { MascotasTable } from '@/app/pages/Mascotas/shared/MascotasTable.jsx';

export function AdminMascotasPage({ onHistory }) {
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
  } = useMascotasList({ mode: 'admin' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Mascotas</h1>
          <p className="text-[#313B72]">Listado de mascotas registradas en Pawlytics.</p>
        </div>
        <button
          onClick={() => loadMascotas()}
          className="px-5 py-3 bg-[#313B72] text-white rounded-xl font-semibold hover:bg-[#462255] transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </div>
      )}

      <MascotasFilters filters={filters} onChange={updateFilter} onSubmit={applyFilters} showOwner />

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
