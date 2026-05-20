import { AlertCircle, ArrowLeft, Brain, RefreshCw } from 'lucide-react';
import { formatDate } from '@/app/functions/clinicalRecordFormatters.js';
import { usePetDiagnoses } from '@/app/hooks/usePetDiagnoses.js';

export function DiagnosticosMascota({ mascota, onBack }) {
  const {
    diagnoses,
    page,
    setPage,
    pagination,
    isLoading,
    errorMessage,
    loadDiagnoses,
  } = usePetDiagnoses(mascota?.id);
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Diagnosticos</h1>
          <p className="text-[#313B72]">Respuestas revisadas para {mascota?.name ?? 'la mascota'}.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => loadDiagnoses(page)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C3F3C0] px-5 py-3 font-bold text-[#462255] transition hover:bg-[#7EE081]"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl bg-[#313B72] px-5 py-3 font-semibold text-white transition hover:bg-[#462255]"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </div>
      )}

      <div className="rounded-3xl border-2 border-[#7EE081]/20 bg-white shadow-lg">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7EE081] to-[#62A87C]">
            <Brain className="h-6 w-6 text-[#462255]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#462255]">Diagnostico mas reciente</h2>
            <p className="text-sm text-gray-600">{pagination?.total ?? diagnoses.length} diagnosticos encontrados</p>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="rounded-xl bg-gray-50 px-4 py-10 text-center text-sm text-[#313B72]">Cargando diagnosticos...</div>
          ) : diagnoses.length === 0 ? (
            <div className="rounded-xl bg-gray-50 px-4 py-10 text-center text-sm text-[#313B72]">
              Aun no hay diagnosticos revisados para esta mascota.
            </div>
          ) : (
            <div className="space-y-4">
              {diagnoses.map((diagnosis, index) => (
                <article
                  key={diagnosis.id}
                  className={`rounded-2xl border p-5 ${
                    index === 0
                      ? 'border-[#62A87C]/50 bg-[#C3F3C0]/20'
                      : 'border-[#7EE081]/20 bg-white'
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#462255]">
                        {index === 0 && page === 1 ? 'Mas reciente' : 'Diagnostico revisado'}
                      </h3>
                      <p className="text-sm text-[#313B72]">Actualizado: {formatDate(diagnosis.updatedAt ?? diagnosis.createdAt)}</p>
                    </div>
                    <span className="rounded-full bg-[#62A87C] px-3 py-1 text-xs font-bold text-[#462255]">Revisado</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-[#313B72]">{diagnosis.person_response}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-sm text-[#313B72]">
          <span>Pagina {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 || isLoading}
              className="rounded-xl bg-gray-100 px-4 py-2 font-semibold disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="rounded-xl bg-[#C3F3C0]/60 px-4 py-2 font-semibold disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
