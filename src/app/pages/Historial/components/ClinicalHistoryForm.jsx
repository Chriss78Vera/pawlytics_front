import { useState } from 'react';
import { FileText, Save } from 'lucide-react';
import { SearchableSelect } from '@/app/components/selectors/SearchableSelect.jsx';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';
import { getOwnerName } from '@/app/pages/Mascotas/shared/mascotasUtils.js';
import clinicalHistoryOptions from '@/app/assets/data/clinicalHistoryOptions.json';
import { buildClinicalHistoryPayload, createClinicalRecordsIfNeeded } from '@/app/functions/clinicalHistoryPayloads.js';
import { validateClinicalHistoryForms } from '@/app/functions/formValidations.js';
import { useHistorialContext } from '@/app/context/HistorialContext.jsx';
import { ClinicalRecordsForm } from './ClinicalRecordsForm.jsx';
import { InputField, SelectField, TextareaField } from './FormFields.jsx';

export function ClinicalHistoryForm({ pets, selectedPet, onCancel, onCreated }) {
  const { canCreateHistory } = useHistorialContext();
  const [form, setForm] = useState(() => ({
    ...clinicalHistoryOptions.initialClinicalHistoryForm,
    id_mascota: selectedPet?.id ? String(selectedPet.id) : '',
  }));
  const [clinicalRecordsForm, setClinicalRecordsForm] = useState(clinicalHistoryOptions.initialClinicalRecordsForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selected = pets.find((pet) => String(pet.id) === String(form.id_mascota)) ?? selectedPet;
  const canSubmit = form.id_mascota && form.tipo_registro && !isSubmitting;

  const update = (field, value) => {
    setError('');
    setForm((current) => ({ ...current, [field]: value }));

    if (field === 'id_mascota') {
      const nextPet = pets.find((pet) => String(pet.id) === String(value));
      if (String(nextPet?.sex ?? '').toLowerCase() === 'macho') {
        setClinicalRecordsForm((current) => ({ ...current, births: '' }));
      }
    }
  };

  const updateClinicalRecord = (field, value) => {
    setError('');
    setClinicalRecordsForm((current) => ({
      ...current,
      [field]: field === 'births' && String(selected?.sex ?? '').toLowerCase() === 'macho' ? '' : value,
    }));
  };

  const updateVaccine = (index, field, value) => {
    setError('');
    setClinicalRecordsForm((current) => ({
      ...current,
      vaccines: current.vaccines.map((vaccine, vaccineIndex) => (
        vaccineIndex === index ? { ...vaccine, [field]: value } : vaccine
      )),
    }));
  };

  const addVaccine = () => {
    setClinicalRecordsForm((current) => ({
      ...current,
      vaccines: [...current.vaccines, { type: '', date: '' }],
    }));
  };

  const removeVaccine = (index) => {
    setClinicalRecordsForm((current) => ({
      ...current,
      vaccines: current.vaccines.length === 1
        ? [{ type: '', date: '' }]
        : current.vaccines.filter((_, vaccineIndex) => vaccineIndex !== index),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    const validationErrors = validateClinicalHistoryForms({
      historyForm: form,
      recordsForm: clinicalRecordsForm,
      pet: selected,
    });

    if (validationErrors.length) {
      setError(validationErrors.join(' '));
      return;
    }

    const confirmed = window.confirm('Antes de guardar, confirma que todos los datos del historial clinico son correctos. Una vez creado no se podra modificar.');
    if (!confirmed) return;

    setIsSubmitting(true);
    setError('');

    try {
      const payload = buildClinicalHistoryPayload(form);
      const created = await pawlyticsApi.createClinicalHistory(payload);
      await createClinicalRecordsIfNeeded(pawlyticsApi, Number(form.id_mascota), clinicalRecordsForm);
      onCreated?.(created);
      setForm(clinicalHistoryOptions.initialClinicalHistoryForm);
      setClinicalRecordsForm(clinicalHistoryOptions.initialClinicalRecordsForm);
    } catch {
      setError('No se pudo crear la historia clinica completa. Revisa los datos e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow border border-[#7EE081]/20">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C3F3C0]">
          <FileText className="h-5 w-5 text-[#462255]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#462255]">Crear historial</h2>
          <p className="text-sm text-[#313B72]">{selected ? `${selected.name} - ${getOwnerName(selected)}` : 'Selecciona una mascota'}</p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-3">
        <SearchableSelect
          label="Mascota"
          value={form.id_mascota}
          onChange={(value) => update('id_mascota', value)}
          options={pets.map((pet) => ({ value: pet.id, label: `${pet.name} - ${getOwnerName(pet)}` }))}
          placeholder="Selecciona"
          searchPlaceholder="Buscar mascota..."
          emptyMessage="No hay mascotas disponibles."
        />
        <InputField
          label="Fecha de registro"
          type="date"
          min={selected?.birthDate || undefined}
          max={new Date().toISOString().slice(0, 10)}
          value={form.fecha_registro}
          onChange={(value) => update('fecha_registro', value)}
        />
        <SelectField label="Tipo" value={form.tipo_registro} onChange={(value) => update('tipo_registro', value)} options={clinicalHistoryOptions.recordTypes} />
        <InputField label="Peso kg" type="number" min="0.1" max="120" step="0.1" value={form.peso} onChange={(value) => update('peso', value)} />
        <InputField label="Temperatura" type="number" min="35" max="43" step="0.1" value={form.temperatura} onChange={(value) => update('temperatura', value)} />
        <InputField label="F. cardiaca" type="number" min="20" max="300" step="1" value={form.frecuencia_cardiaca} onChange={(value) => update('frecuencia_cardiaca', value)} />
        <InputField label="F. respiratoria" type="number" min="5" max="120" step="1" value={form.frecuencia_respiratoria} onChange={(value) => update('frecuencia_respiratoria', value)} />
        <SelectField
          label="Alimentacion"
          value={form.come_normal ? 'normal' : 'alterada'}
          onChange={(value) => update('come_normal', value === 'normal')}
          options={clinicalHistoryOptions.feedingStates}
        />
        <InputField label="Estado de animo" value={form.estado_animo} onChange={(value) => update('estado_animo', value)} />
        <SelectField label="Actividad" value={form.nivel_actividad} onChange={(value) => update('nivel_actividad', value)} options={clinicalHistoryOptions.activityLevels} />
        <InputField label="Sintoma" value={form.sintoma_nombre} onChange={(value) => update('sintoma_nombre', value)} />
        <SelectField label="Intensidad" value={form.sintoma_intensidad} onChange={(value) => update('sintoma_intensidad', value)} options={clinicalHistoryOptions.intensities} />
        <InputField label="Duracion" value={form.sintoma_duracion} onChange={(value) => update('sintoma_duracion', value)} />
        <InputField label="Frecuencia" value={form.sintoma_frecuencia} onChange={(value) => update('sintoma_frecuencia', value)} />
        <TextareaField label="Detalle de alimentacion" value={form.alimentacion_descripcion} onChange={(value) => update('alimentacion_descripcion', value)} className="md:col-span-3" />
        <TextareaField label="Observaciones" value={form.observaciones} onChange={(value) => update('observaciones', value)} className="md:col-span-3" />
      </div>

      <ClinicalRecordsForm
        form={clinicalRecordsForm}
        onChange={updateClinicalRecord}
        onVaccineChange={updateVaccine}
        onAddVaccine={addVaccine}
        onRemoveVaccine={removeVaccine}
        canManage={canCreateHistory}
        selectedPet={selected}
      />

      <div className="mt-5 flex gap-3">
        <button type="button" onClick={onCancel} className="rounded-xl bg-[#313B72] px-5 py-3 font-semibold text-white">Cancelar</button>
        <button disabled={!canSubmit} className="flex items-center gap-2 rounded-xl bg-[#62A87C] px-5 py-3 font-bold text-[#462255] disabled:opacity-50">
          <Save className="h-5 w-5" />
          {isSubmitting ? 'Guardando...' : 'Guardar historial'}
        </button>
      </div>
    </form>
  );
}
