import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAiAnalysis } from '@/app/hooks/useAiAnalysis.js';
import { AnalysisHistoryList } from './components/AnalysisHistoryList.jsx';
import { AnalysisLoading } from './components/AnalysisLoading.jsx';
import { AnalysisReview } from './components/AnalysisReview.jsx';

export function AnalisisPage({ user }) {
  const {
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
  } = useAiAnalysis(user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#462255]">Analisis IA</h1>
        <p className="text-[#313B72]">Selecciona un historial medico actual y revisa la respuesta antes de confirmarla.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}
      {message && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#7EE081]/40 bg-[#C3F3C0]/30 px-5 py-4 text-[#313B72]">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-semibold">{message}</span>
        </div>
      )}

      {isAnalyzing ? (
        <AnalysisLoading />
      ) : analysis ? (
        <AnalysisReview
          analysis={analysis}
          selectedHistory={selectedHistory}
          reviewText={reviewText}
          onReviewChange={setReviewText}
          onBackToHistories={() => setAnalysis(null)}
          onSaveReview={saveReview}
          isSaving={isSavingReview}
        />
      ) : (
        <AnalysisHistoryList
          histories={histories}
          pagination={pagination}
          isLoading={isLoading}
          onRefresh={loadHistories}
          onAnalyze={analyzeHistory}
        />
      )}
    </div>
  );
}
