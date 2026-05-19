import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, PawPrint, Plus } from 'lucide-react';
import { SearchableSelect, normalizeList, normalizeSelectOptions } from './selectors/SearchableSelect.jsx';
import { pawlyticsApi } from '../service/pawlyticsApi.js';

const initialForm = {
  typeId: '',
  breedId: '',
  name: '',
  birthDate: '',
  color: '',
  sex: '',
  weight: '',
  particularSigns: '',
};

export function MascotaForm({ userDataId, onCancel, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [tipos, setTipos] = useState([]);
  const [razas, setRazas] = useState([]);
  const [isLoadingTipos, setIsLoadingTipos] = useState(true);
  const [isLoadingRazas, setIsLoadingRazas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const isSubmitDisabled = isSubmitting
    || !form.typeId
    || !form.breedId
    || !form.name.trim()
    || !form.birthDate
    || !form.color.trim()
    || !form.sex
    || !form.weight;

  useEffect(() => {
    let isActive = true;

    pawlyticsApi.getTipos()
      .then((response) => {
        if (isActive) {
          setTipos(normalizeList(response));
        }
      })
      .catch(() => {
        if (isActive) {
          setMessage('No se pudieron cargar los tipos de mascota.');
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingTipos(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!form.typeId) {
      setRazas([]);
      return;
    }

    let isActive = true;
    setIsLoadingRazas(true);
    setForm((current) => ({ ...current, breedId: '' }));

    pawlyticsApi.getRazasByTipo(form.typeId)
      .then((response) => {
        if (isActive) {
          setRazas(normalizeList(response));
        }
      })
      .catch(() => {
        if (isActive) {
          setRazas([]);
          setMessage('No se pudieron cargar las razas para el tipo seleccionado.');
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingRazas(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [form.typeId]);

  const updateField = (field, value) => {
    setMessage('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const created = await pawlyticsApi.createMascota({
        typeId: form.typeId,
        breedId: form.breedId,
        name: form.name.trim(),
        birthDate: form.birthDate,
        color: form.color.trim(),
        sex: form.sex,
        weight: Number(form.weight),
        particularSigns: form.particularSigns.trim(),
        userDataId,
      });

      setForm(initialForm);
      setRazas([]);
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
          <p className="text-sm text-[#313B72]">Registra los datos principales de tu compañero.</p>
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
          disabled={isLoadingTipos}
          placeholder={isLoadingTipos ? 'Cargando tipos...' : 'Selecciona un tipo'}
          searchPlaceholder="Buscar tipo..."
          emptyMessage="No se encontraron tipos."
          options={normalizeSelectOptions(tipos)}
        />
        <SearchableSelect
          label="Raza"
          value={form.breedId}
          onChange={(value) => updateField('breedId', value)}
          disabled={!form.typeId || isLoadingRazas}
          placeholder={isLoadingRazas ? 'Cargando razas...' : 'Selecciona una raza'}
          searchPlaceholder="Buscar raza..."
          emptyMessage="No se encontraron razas."
          options={normalizeSelectOptions(razas)}
        />
        <FormInput label="Nombre" value={form.name} onChange={(value) => updateField('name', value)} />
        <FormInput label="Fecha de nacimiento" type="date" value={form.birthDate} onChange={(value) => updateField('birthDate', value)} />
        <FormInput label="Color" value={form.color} onChange={(value) => updateField('color', value)} />
        <SearchableSelect
          label="Sexo"
          value={form.sex}
          onChange={(value) => updateField('sex', value)}
          placeholder="Selecciona el sexo"
          searchPlaceholder="Buscar sexo..."
          emptyMessage="No se encontraron opciones."
          options={[
            { value: 'Macho', label: 'Macho' },
            { value: 'Hembra', label: 'Hembra' },
          ]}
        />
        <FormInput label="Peso (kg)" type="number" min="0" step="0.1" value={form.weight} onChange={(value) => updateField('weight', value)} />
        <label className="block">
          <span className="text-sm font-semibold text-[#462255]">Señas particulares</span>
          <textarea
            value={form.particularSigns}
            onChange={(event) => updateField('particularSigns', event.target.value)}
            rows={3}
            className="mt-2 w-full px-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7EE081] resize-none"
            placeholder="Mancha blanca en el pecho"
          />
        </label>

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

function FormInput({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#462255]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required
        className="mt-2 w-full px-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7EE081]"
        {...props}
      />
    </label>
  );
}
