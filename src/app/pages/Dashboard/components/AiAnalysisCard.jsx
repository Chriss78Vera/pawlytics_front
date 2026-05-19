import { Brain } from 'lucide-react';

export function AiAnalysisCard({ totalHistories, healthAlerts }) {
  return (
    <div className="bg-gradient-to-br from-[#462255] to-[#313B72] rounded-3xl p-6 text-white shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#7EE081] rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#462255]" />
        </div>
        <h3 className="font-bold text-lg">Resumen clinico</h3>
      </div>
      <div className="space-y-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm"><strong>{totalHistories}</strong> historiales disponibles para analisis.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm"><strong>{healthAlerts}</strong> registros con sintomas de intensidad alta.</p>
        </div>
      </div>
    </div>
  );
}
