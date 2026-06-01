import { ArrowLeft, Brain, CheckCircle2, Save } from 'lucide-react';
import { HistorySummary } from './HistorySummary.jsx';

export function AnalysisReview({
  analysis,
  selectedHistory,
  reviewText,
  onReviewChange,
  onBackToHistories,
  onSaveReview,
  isSaving,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <HistorySummary history={selectedHistory} />
      <div className="rounded-2xl border border-[#7EE081]/20 bg-white p-6 shadow">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C3F3C0]">
            <Brain className="h-5 w-5 text-[#462255]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#462255]">Revision del analisis</h2>
            <p className="text-sm text-[#313B72]">Edita la propuesta o diagnostico existente antes de guardarlo como respuesta veterinaria.</p>
          </div>
          <span className={`ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
            analysis.state
              ? 'bg-[#C3F3C0] text-[#462255]'
              : 'bg-yellow-50 text-yellow-800 ring-1 ring-yellow-200'
          }`}>
            {analysis.state && <CheckCircle2 className="h-4 w-4" />}
            {analysis.state ? 'Revisada' : 'Pendiente'}
          </span>
        </div>

        <label className="mb-2 block text-sm font-bold text-[#462255]">Respuesta editable</label>
        <p className="mb-3 text-sm text-[#313B72]">
          La respuesta disponible ya esta cargada aqui. Ajusta el texto completo segun tu criterio clinico.
        </p>
        <textarea
          value={reviewText}
          onChange={(event) => onReviewChange(event.target.value)}
          rows={14}
          className="min-h-[360px] w-full resize-y rounded-xl border border-[#7EE081]/40 bg-[#FBFFFB] p-4 text-sm leading-6 text-[#313B72] outline-none transition focus:border-[#62A87C] focus:bg-white focus:ring-2 focus:ring-[#C3F3C0]"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onBackToHistories}
            className="inline-flex items-center gap-2 rounded-xl bg-[#313B72] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#462255] focus:outline-none focus:ring-2 focus:ring-[#313B72]/30"
          >
            <ArrowLeft className="h-5 w-5" />
            Ver historiales
          </button>
          <button
            type="button"
            onClick={onSaveReview}
            disabled={isSaving || !reviewText.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#62A87C] px-5 py-3 font-bold text-[#462255] shadow-sm transition hover:bg-[#7EE081] focus:outline-none focus:ring-2 focus:ring-[#62A87C]/40 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {isSaving ? 'Guardando...' : 'Guardar revision'}
          </button>
        </div>
      </div>
    </div>
  );
}
