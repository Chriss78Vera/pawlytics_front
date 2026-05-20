import { formatDate } from '@/app/functions/clinicalRecordFormatters.js';

export function HistorySummary({ history, compact = false }) {
  if (!history) return null;

  const symptoms = Array.isArray(history.sintomas) ? history.sintomas : [];

  return (
    <div className={compact ? '' : 'rounded-2xl border border-[#7EE081]/20 bg-white p-5 shadow'}>
      <div className="font-bold text-[#462255]">Mascota #{history.id_mascota} - {history.tipo_registro || 'Historial clinico'}</div>
      <div className="mt-1 text-sm text-[#313B72]">{formatDate(history.fecha_registro)} - Estado: {history.estado || '-'}</div>
      <div className="mt-3 text-sm text-[#313B72]">
        {symptoms.length
          ? symptoms.map((symptom) => symptom.nombre).filter(Boolean).join(', ')
          : 'Sin sintomas registrados'}
      </div>
      {!compact && (
        <div className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-[#313B72]">
          {history.observaciones || 'Sin observaciones registradas.'}
        </div>
      )}
    </div>
  );
}
