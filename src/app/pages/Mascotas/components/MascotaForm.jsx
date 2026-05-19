import { useState } from 'react';
import { AlertCircle, ArrowLeft, PawPrint, Plus } from 'lucide-react';
import { SearchableSelect } from '@/app/components/selectors/SearchableSelect.jsx';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';
import { TextAreaInput, TextInput } from '@/app/components/forms/FormControls.jsx';
import { usePetCatalogOptions } from '@/app/components/selectors/usePetCatalogOptions.js';
import mascotasOptions from '@/app/assets/data/mascotasOptions.json';
import { buildMascotaPayload } from '@/app/functions/mascotasUtils.js';

export function MascotaForm({ userDataId, onCancel, onCreated }) {
  const [form, setForm] = useState(mascotasOptions.initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { typeOptions, breedOptions, isLoadingTypes, isLoadingBreeds } = usePetCatalogOptions(form.typeId);

  const isSubmitDisabled = isSubmitting
    || !form.typeId
    || !form.breedId
    || !form.name.trim()
    || !form.birthDate
    || !form.color.trim()
    || !form.sex
    || !form.weight;

  const updateField = (field, value) => {
    setMessage('');
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'typeId' ? { breedId: '' } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const created = await pawlyticsApi.createMascota(buildMascotaPayload(form, userDataId));
      setForm(mascotasOptions.initialForm);
      setMessage('Mascota registrada correctamente.');
      onCreated?.(created);
    } catch {
      setMessage('No se pudo registrar la mascota. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#7EE081]/20">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-[#7EE081] to-[#62A87C] rounded-2xl flex items-center justify-center">
          <PawPrint className="w-6 h-6 text-[#462255]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#462255]">Agregar mascota</h2>
          <p className="text-sm text-[#313B72]">Registra los datos principales de tu mascota.</p>
        </div>
      </div>

      {message && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#7EE081]/40 bg-[#C3F3C0]/30 px-4 py-3 text-[#313B72]">
          <AlertCircle className="w-5 h-5 text-[#62A87C]" />
          <span className="text-sm font-semibold">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <SearchableSelect
          label="Tipo"
          value={form.typeId}
          onChange={(value) => updateField('typeId', value)}
          disabled={isLoadingTypes}
          placeholder={isLoadingTypes ? 'Cargando tipos...' : 'Selecciona un tipo'}
          searchPlaceholder="Buscar tipo..."
          emptyMessage="No se encontraron tipos."
          options={typeOptions}
        />
        <SearchableSelect
          label="Raza"
          value={form.breedId}
          onChange={(value) => updateField('breedId', value)}
          disabled={!form.typeId || isLoadingBreeds}
          placeholder={isLoadingBreeds ? 'Cargando razas...' : 'Selecciona una raza'}
          searchPlaceholder="Buscar raza..."
          emptyMessage="No se encontraron razas."
          options={breedOptions}
        />
        <TextInput label="Nombre" value={form.name} onChange={(value) => updateField('name', value)} />
        <TextInput label="Fecha de nacimiento" type="date" value={form.birthDate} onChange={(value) => updateField('birthDate', value)} />
        <TextInput label="Color" value={form.color} onChange={(value) => updateField('color', value)} />
        <SearchableSelect
          label="Sexo"
          value={form.sex}
          onChange={(value) => updateField('sex', value)}
          placeholder="Selecciona el sexo"
          searchPlaceholder="Buscar sexo..."
          emptyMessage="No se encontraron opciones."
          options={mascotasOptions.sexOptions}
        />
        <TextInput label="Peso (kg)" type="number" min="0" step="0.1" value={form.weight} onChange={(value) => updateField('weight', value)} />
        <TextAreaInput
          label="Senas particulares"
          value={form.particularSigns}
          onChange={(value) => updateField('particularSigns', value)}
          placeholder="Mancha blanca en el pecho"
        />

        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-[#313B72] text-white rounded-xl font-semibold hover:bg-[#462255] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#7EE081] to-[#62A87C] text-[#462255] rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            {isSubmitting ? 'Guardando...' : 'Registrar mascota'}
          </button>
        </div>
      </form>
    </div>
  );
}
