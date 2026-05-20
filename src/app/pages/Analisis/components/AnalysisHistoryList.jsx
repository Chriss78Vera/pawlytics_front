import { RefreshCw, Sparkles } from 'lucide-react';
import { HistorySummary } from './HistorySummary.jsx';

export function AnalysisHistoryList({
  histories,
  pagination,
  isLoading,
  onRefresh,
  onAnalyze,
}) {
  return (
    <div className="rounded-2xl border border-[#7EE081]/20 bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-[#462255]">Historiales medicos actuales</h2>
        <button
          type="button"
          onClick={() => onRefresh(pagination.page)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C3F3C0] px-4 py-2 text-sm font-bold text-[#462255] shadow-sm transition hover:bg-[#7EE081] focus:outline-none focus:ring-2 focus:ring-[#62A87C]/30"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-[#313B72]">Cargando historiales...</div>
      ) : histories.length === 0 ? (
        <div className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-[#313B72]">No hay historiales disponibles para analizar.</div>
      ) : (
        <div className="space-y-3">
          {histories.map((history) => (
            <div key={history.id} className="grid gap-4 rounded-xl border border-[#7EE081]/20 p-4 transition hover:border-[#62A87C]/50 hover:bg-[#C3F3C0]/10 md:grid-cols-[1fr_auto] md:items-center">
              <HistorySummary history={history} compact />
              <button
                type="button"
                onClick={() => onAnalyze(history)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#62A87C] px-5 py-3 font-bold text-[#462255] shadow-sm transition hover:bg-[#7EE081] focus:outline-none focus:ring-2 focus:ring-[#62A87C]/40"
              >
                <Sparkles className="h-5 w-5" />
                Analizar IA
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
