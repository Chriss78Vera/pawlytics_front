import { Eye, RefreshCw } from 'lucide-react';
import { getOwnerName } from '@/app/pages/Mascotas/shared/mascotasUtils.js';
import { formatDate } from '@/app/functions/clinicalRecordFormatters.js';

export function HistoryTable({ histories, petById, isLoading, pagination, onPageChange, onRefresh, onViewDetail }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow border border-[#7EE081]/20">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-[#462255]">Registros</h2>
          <p className="text-sm text-[#313B72]">{pagination?.total ?? histories.length} historiales encontrados</p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-2 rounded-xl bg-[#313B72] px-4 py-2 font-semibold text-white">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#C3F3C0]/40 text-[#462255]">
            <tr>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Mascota</th>
              <th className="px-5 py-3">Propietario</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Observaciones</th>
              <th className="px-5 py-3">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="7" className="px-5 py-10 text-center text-[#313B72]">Cargando historial...</td></tr>
            ) : histories.length === 0 ? (
              <tr><td colSpan="7" className="px-5 py-10 text-center text-[#313B72]">No hay historiales registrados.</td></tr>
            ) : histories.map((history) => {
              const pet = petById[String(history.id_mascota)];
              return (
                <tr key={history.id} className="hover:bg-[#C3F3C0]/20">
                  <td className="px-5 py-4 text-sm">{formatDate(history.fecha_registro)}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#462255]">{pet?.name ?? history.id_mascota}</td>
                  <td className="px-5 py-4 text-sm">{pet ? getOwnerName(pet) : '-'}</td>
                  <td className="px-5 py-4 text-sm">{history.tipo_registro}</td>
                  <td className="px-5 py-4 text-sm">{history.estado}</td>
                  <td className="px-5 py-4 text-sm">{history.observaciones || '-'}</td>
                  <td className="px-5 py-4 text-sm">
                    <button
                      onClick={() => onViewDetail?.(history)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#313B72] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#462255]"
                    >
                      <Eye className="h-4 w-4" />
                      Ver detalle
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-[#313B72]">
        <span>Pagina {pagination?.page ?? 1} de {pagination?.totalPages ?? 1}</span>
        <div className="flex gap-2">
          <button onClick={() => onPageChange((pagination?.page ?? 1) - 1)} disabled={(pagination?.page ?? 1) <= 1 || isLoading} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold disabled:opacity-50">Anterior</button>
          <button onClick={() => onPageChange((pagination?.page ?? 1) + 1)} disabled={(pagination?.page ?? 1) >= (pagination?.totalPages ?? 1) || isLoading} className="rounded-xl bg-[#C3F3C0]/60 px-4 py-2 font-semibold disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
}
