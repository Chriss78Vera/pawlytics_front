import { Plus, Stethoscope, Trash2 } from 'lucide-react';
import clinicalHistoryOptions from '@/app/assets/data/clinicalHistoryOptions.json';
import { InputField, SelectField, TextareaField } from './FormFields.jsx';

export function ClinicalRecordsForm({ form, onChange, onVaccineChange, onAddVaccine, onRemoveVaccine, canManage, selectedPet }) {
  if (!canManage) {
    return null;
  }

  const isMale = String(selectedPet?.sex ?? '').toLowerCase() === 'macho';
  const today = new Date().toISOString().slice(0, 10);
  const minClinicalDate = selectedPet?.birthDate || undefined;

  return (
    <div className="mt-6 border-t border-[#7EE081]/20 pt-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#313B72]">
          <Stethoscope className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#462255]">Detalle clinico relacional</h3>
          <p className="text-sm text-[#313B72]">Datos complementarios para vacunas, tratamientos y antecedentes.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <InputField label="Dieta" value={form.diet} onChange={(value) => onChange('diet', value)} />
        <SelectField
          label="Esterilizacion"
          value={form.sterilization}
          onChange={(value) => onChange('sterilization', value)}
          options={clinicalHistoryOptions.sterilizationStates}
        />
        <InputField
          label="Partos"
          type="number"
          min="0"
          max="30"
          step="1"
          value={isMale ? '' : form.births}
          disabled={isMale}
          placeholder={isMale ? 'No aplica para macho' : ''}
          onChange={(value) => onChange('births', value)}
        />
        <InputField label="Convive con animales" value={form.animals} onChange={(value) => onChange('animals', value)} />
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="font-bold text-[#462255]">Vacunas</h4>
          <button type="button" onClick={onAddVaccine} className="inline-flex items-center gap-2 rounded-xl bg-[#C3F3C0] px-3 py-2 text-sm font-bold text-[#462255]">
            <Plus className="h-4 w-4" />
            Agregar vacuna
          </button>
        </div>
        <div className="space-y-3">
          {form.vaccines.map((vaccine, index) => (
            <div key={`vaccine-${index}`} className="grid gap-3 rounded-xl bg-gray-50 p-3 md:grid-cols-[1fr_220px_auto]">
              <InputField label="Tipo de vacuna" value={vaccine.type} onChange={(value) => onVaccineChange(index, 'type', value)} />
              <InputField label="Fecha" type="date" min={minClinicalDate} max={today} value={vaccine.date} onChange={(value) => onVaccineChange(index, 'date', value)} />
              <button type="button" onClick={() => onRemoveVaccine(index)} className="self-end rounded-xl bg-white p-3 text-red-600 ring-1 ring-red-100">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-4">
          <h4 className="mb-3 font-bold text-[#462255]">Desparasitacion</h4>
          <div className="grid gap-3">
            <InputField label="Tipo" value={form.dewormingType} onChange={(value) => onChange('dewormingType', value)} />
            <InputField label="Fecha" type="date" min={minClinicalDate} max={today} value={form.dewormingDate} onChange={(value) => onChange('dewormingDate', value)} />
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <h4 className="mb-3 font-bold text-[#462255]">Cirugia</h4>
          <div className="grid gap-3">
            <InputField label="Tipo" value={form.surgeryType} onChange={(value) => onChange('surgeryType', value)} />
            <InputField label="Fecha" type="date" min={minClinicalDate} max={today} value={form.surgeryDate} onChange={(value) => onChange('surgeryDate', value)} />
            <TextareaField label="Descripcion" value={form.surgeryDescription} onChange={(value) => onChange('surgeryDescription', value)} rows={2} inputClassName="bg-white" />
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <h4 className="mb-3 font-bold text-[#462255]">Enfermedad</h4>
          <div className="grid gap-3">
            <InputField label="Nombre" value={form.diseaseName} onChange={(value) => onChange('diseaseName', value)} />
            <InputField label="Tratamiento" value={form.diseaseTreatment} onChange={(value) => onChange('diseaseTreatment', value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
