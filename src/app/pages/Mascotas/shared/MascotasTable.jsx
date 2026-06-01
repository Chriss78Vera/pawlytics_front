import { Brain, Download, FileText, PawPrint } from 'lucide-react';
import { getOwnerName } from './mascotasUtils.js';

export function MascotasTable({ mascotas, isLoading, pagination, onPageChange, onHistory, onDiagnosis, onDownloadReport }) {
  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-[#7EE081]/20 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[#7EE081] to-[#62A87C] rounded-2xl flex items-center justify-center">
          <PawPrint className="w-6 h-6 text-[#462255]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#462255]">Registro de mascotas</h2>
          <p className="text-sm text-gray-600">{pagination?.total ?? mascotas.length} mascotas encontradas</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#C3F3C0]/40 text-[#462255]">
            <tr>
              <TableHead>Propietario</TableHead>
              <TableHead>Nombre Mascota</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Género</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Raza</TableHead>
              <TableHead>Acciones</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-[#313B72]">
                  Cargando mascotas...
                </td>
              </tr>
            ) : mascotas.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-[#313B72]">
                  No hay mascotas registradas.
                </td>
              </tr>
            ) : (
              mascotas.map((mascota) => (
                <tr key={mascota.id} className="hover:bg-[#C3F3C0]/20 transition-colors">
                  <TableCell>{getOwnerName(mascota)}</TableCell>
                  <TableCell className="font-bold text-[#462255]">{mascota.name}</TableCell>
                  <TableCell>{mascota.color}</TableCell>
                  <TableCell>{mascota.sex}</TableCell>
                  <TableCell>{mascota.type?.name ?? mascota.type?.nombre ?? '-'}</TableCell>
                  <TableCell>{mascota.breed?.name ?? mascota.breed?.nombre ?? '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onHistory?.(mascota)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#313B72] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#462255]"
                      >
                        <FileText className="w-4 h-4" />
                        Historial
                      </button>
                      {onDiagnosis && (
                        <button
                          type="button"
                          onClick={() => onDiagnosis(mascota)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#62A87C] px-4 py-2 font-bold text-[#462255] transition-colors hover:bg-[#7EE081]"
                        >
                          <Brain className="w-4 h-4" />
                          Diagnostico
                        </button>
                      )}
                      {onDownloadReport && (
                        <button
                          type="button"
                          onClick={() => onDownloadReport(mascota)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#C3F3C0] px-4 py-2 font-bold text-[#462255] transition-colors hover:bg-[#7EE081]"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-sm text-[#313B72]">
        <span>Pagina {page} de {totalPages}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1 || isLoading}
            className="px-4 py-2 rounded-xl bg-gray-100 font-semibold disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="px-4 py-2 rounded-xl bg-[#C3F3C0]/60 font-semibold disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

function TableHead({ children }) {
  return <th className="px-6 py-4 text-sm font-bold">{children}</th>;
}

function TableCell({ children, className = '' }) {
  return <td className={`px-6 py-4 text-sm text-gray-700 ${className}`}>{children}</td>;
}
