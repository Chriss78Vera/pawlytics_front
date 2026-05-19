import {
  formatDisease,
  formatSimpleRecord,
  formatSurgery,
  formatVaccines,
} from '@/app/functions/clinicalRecordFormatters.js';
import { ReadOnlyField } from './FormFields.jsx';

export function ClinicalRecordsDetailList({ details, isLoading, canManage }) {
  return (
    <div className="mt-6 border-t border-[#7EE081]/20 pt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-[#462255]">Detalle clinico relacional</h3>
        <span className="rounded-full bg-[#C3F3C0]/70 px-3 py-1 text-xs font-bold text-[#462255]">
          {canManage ? 'Veterinario' : 'Solo lectura'}
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-[#313B72]">Cargando detalle clinico...</div>
      ) : details.length === 0 ? (
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-[#313B72]">Sin detalle clinico relacional registrado.</div>
      ) : (
        <div className="space-y-4">
          {details.map((detail) => (
            <div key={detail.id} className="rounded-xl border border-[#7EE081]/30 bg-[#C3F3C0]/10 p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <ReadOnlyField label="Dieta" value={detail.diet} />
                <ReadOnlyField label="Esterilizacion" value={detail.sterilization === undefined ? '-' : detail.sterilization ? 'Si' : 'No'} />
                <ReadOnlyField label="Partos" value={detail.births} />
                <ReadOnlyField label="Convive con animales" value={detail.animals} />
                <ReadOnlyField label="Desparasitacion" value={formatSimpleRecord(detail.deworming)} />
                <ReadOnlyField label="Cirugia" value={formatSurgery(detail.surgery)} />
                <ReadOnlyField label="Enfermedad" value={formatDisease(detail.disease)} />
                <ReadOnlyField label="Vacunas" value={formatVaccines(detail.vaccines)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
