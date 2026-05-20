import { Loader2 } from 'lucide-react';

export function AnalysisLoading() {
  return (
    <div className="rounded-2xl border border-[#7EE081]/30 bg-white p-8 text-center shadow">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C3F3C0]">
        <Loader2 className="h-8 w-8 animate-spin text-[#62A87C]" />
      </div>
      <h2 className="text-xl font-bold text-[#462255]">Analizando el diagnostico</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-[#313B72]">La IA esta revisando sintomas, historial y detalle clinico relacional. En cuanto responda, el texto aparecera listo para editar.</p>
    </div>
  );
}
