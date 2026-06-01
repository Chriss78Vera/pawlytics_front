import { ArrowLeft, FileText } from 'lucide-react';
import { getOwnerName } from '@/app/pages/Mascotas/shared/mascotasUtils.js';
import { formatDate, formatMetric } from '@/app/functions/clinicalRecordFormatters.js';
import { useClinicalDetails } from '@/app/hooks/useClinicalDetails.js';
import { useHistorialContext } from '@/app/context/HistorialContext.jsx';
import { ClinicalRecordsDetailList } from './ClinicalRecordsDetailList.jsx';
import { ReadOnlyField } from './FormFields.jsx';

export function HistoryDetail({ history, pet, onBack }) {
  const { canCreateHistory } = useHistorialContext();
  const symptoms = Array.isArray(history.sintomas) ? history.sintomas : [];
  const healthData = history.datos_salud ?? {};
  const feeding = history.alimentacion ?? {};
  const behavior = history.comportamiento ?? {};
  const { clinicalDetails, isLoadingDetails } = useClinicalDetails(history.id_mascota);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Detalle del historial</h1>
          <p className="text-[#313B72]">Consulta de informacion medica en modo solo lectura.</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl bg-[#313B72] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#462255]"
        >
          <ArrowLeft className="h-5 w-5" />
          Regresar
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow border border-[#7EE081]/20">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C3F3C0]">
              <FileText className="h-6 w-6 text-[#462255]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#462255]">{pet?.name ?? `Mascota #${history.id_mascota}`}</h2>
              <p className="text-sm text-[#313B72]">{pet ? getOwnerName(pet) : 'Propietario no disponible'}</p>
            </div>
          </div>
          <div className="text-right text-sm text-[#313B72]">
            <div className="font-bold text-[#462255]">{history.tipo_registro}</div>
            <div>{formatDate(history.fecha_registro)}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ReadOnlyField label="Estado" value={history.estado} />
          <ReadOnlyField label="Peso" value={formatMetric(healthData.peso, 'kg')} />
          <ReadOnlyField label="Temperatura" value={formatMetric(healthData.temperatura, 'C')} />
          <ReadOnlyField label="F. cardiaca" value={formatMetric(healthData.frecuencia_cardiaca, 'lpm')} />
          <ReadOnlyField label="F. respiratoria" value={formatMetric(healthData.frecuencia_respiratoria, 'rpm')} />
          <ReadOnlyField label="Alimentacion" value={feeding.come_normal === undefined ? '-' : feeding.come_normal ? 'Normal' : 'Alterada'} />
          <ReadOnlyField label="Detalle alimentacion" value={feeding.descripcion} className="md:col-span-2" />
          <ReadOnlyField label="Estado de animo" value={behavior.estado_animo} />
          <ReadOnlyField label="Nivel de actividad" value={behavior.nivel_actividad} />
          <ReadOnlyField label="Observaciones" value={history.observaciones} className="md:col-span-3" />
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-lg font-bold text-[#462255]">Sintomas</h3>
          {symptoms.length === 0 ? (
            <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-[#313B72]">Sin sintomas registrados.</div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {symptoms.map((symptom, index) => (
                <div key={`${symptom.nombre}-${index}`} className="rounded-xl border border-[#7EE081]/30 bg-[#C3F3C0]/20 p-4">
                  <div className="font-bold text-[#462255]">{symptom.nombre}</div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-[#313B72]">
                    <span>Intensidad: {symptom.intensidad}</span>
                    <span>Duracion: {symptom.duracion}</span>
                    <span>Frecuencia: {symptom.frecuencia}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <ClinicalRecordsDetailList
          details={clinicalDetails}
          isLoading={isLoadingDetails}
          canManage={canCreateHistory}
        />
      </div>
    </div>
  );
}
