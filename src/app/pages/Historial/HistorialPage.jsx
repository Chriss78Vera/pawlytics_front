import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Eye, FileText, Plus, RefreshCw, Save } from 'lucide-react';
import { pawlyticsApi } from '../../service/pawlyticsApi.js';
import { getOwnerName, normalizeMascotas, normalizePagination } from '../Mascotas/shared/mascotasUtils.js';
import { SearchableSelect } from '../../components/selectors/SearchableSelect.jsx';
import { usePetCatalogOptions } from '../../components/selectors/usePetCatalogOptions.js';

const initialFilters = {
  search: '',
  petName: '',
  typeId: '',
  breedId: '',
  sex: '',
  owner: '',
  recordType: '',
  status: '',
  from: '',
  to: '',
};

const initialForm = {
  id_mascota: '',
  fecha_registro: '',
  tipo_registro: 'consulta',
  sintoma_nombre: '',
  sintoma_intensidad: 'media',
  sintoma_duracion: '',
  sintoma_frecuencia: '',
  peso: '',
  temperatura: '',
  frecuencia_cardiaca: '',
  frecuencia_respiratoria: '',
  come_normal: true,
  alimentacion_descripcion: '',
  estado_animo: '',
  nivel_actividad: 'medio',
  observaciones: '',
};

export function HistorialPage({ user, selectedPet, initialView = 'list' }) {
  const canCreate = user.role === 'veterinario';
  const [view, setView] = useState(canCreate && initialView === 'create' ? 'create' : 'list');
  const [histories, setHistories] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(normalizePagination());
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const petById = useMemo(() => {
    return Object.fromEntries(pets.map((pet) => [String(pet.id), pet]));
  }, [pets]);

  const loadPets = async () => {
    const response = user.role === 'cliente'
      ? await pawlyticsApi.getMascotasByUserData(user.userDataId, { page: 1, limit: 50 })
      : await pawlyticsApi.getMascotas({ page: 1, limit: 50 });
    setPets(normalizeMascotas(response));
  };

  const loadHistories = async (nextPage = page) => {
    setIsLoading(true);
    setMessage('');

    try {
      const roleFilters = user.role === 'cliente' ? { userDataId: user.userDataId } : {};
      const response = selectedPet
        ? await pawlyticsApi.getClinicalHistoryByPet(selectedPet.id, { page: nextPage, limit: 5, filters })
        : await pawlyticsApi.getClinicalHistory({ page: nextPage, limit: 5, filters: { ...filters, ...roleFilters } });

      setHistories(Array.isArray(response?.data) ? response.data : []);
      setPagination(normalizePagination(response));
    } catch {
      setHistories([]);
      setPagination(normalizePagination());
      setMessage('No se pudo cargar el historial clinico.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPets().catch(() => setPets([]));
  }, [user.role, user.userDataId]);

  useEffect(() => {
    setView(canCreate && initialView === 'create' ? 'create' : 'list');
    setSelectedHistory(null);
    setPage(1);
  }, [initialView, selectedPet?.id, canCreate]);

  useEffect(() => {
    if (view !== 'list') {
      return;
    }

    loadHistories();
  }, [page, selectedPet?.id, view]);

  const applyFilters = () => {
    setPage(1);
    loadHistories(1);
  };

  const handleCreated = (created) => {
    setView('list');
    setPage(1);
    setHistories((current) => [created, ...current].slice(0, 5));
    setMessage('Historia clinica registrada correctamente.');
  };

  const showDetail = (history) => {
    setSelectedHistory(history);
    setView('detail');
  };

  const backToList = () => {
    setSelectedHistory(null);
    setView('list');
  };

  if (view === 'create' && canCreate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#462255]">Crear historial clinico</h1>
            <p className="text-[#313B72]">Registra la informacion medica de la mascota seleccionada.</p>
          </div>
          <button
            onClick={() => setView('list')}
            className="flex items-center gap-2 rounded-xl bg-[#313B72] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#462255]"
          >
            <ArrowLeft className="h-5 w-5" />
            Regresar
          </button>
        </div>

        <ClinicalHistoryForm
          pets={pets}
          selectedPet={selectedPet}
          onCancel={() => setView('list')}
          onCreated={handleCreated}
        />
      </div>
    );
  }

  if (view === 'detail' && selectedHistory) {
    return (
      <HistoryDetail
        history={selectedHistory}
        pet={petById[String(selectedHistory.id_mascota)]}
        onBack={backToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Historial clinico</h1>
          <p className="text-[#313B72]">
            {selectedPet
              ? `Historiales registrados para ${selectedPet.name}.`
              : user.role === 'cliente'
              ? 'Consulta el historial de tus mascotas.'
              : 'Consulta y filtra los historiales registrados.'}
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 rounded-xl bg-[#62A87C] px-5 py-3 font-bold text-[#462255]"
          >
            <Plus className="h-5 w-5" />
            Nuevo historial
          </button>
        )}
      </div>

      {message && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#7EE081]/40 bg-[#C3F3C0]/30 px-5 py-4 text-[#313B72]">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{message}</span>
        </div>
      )}

      <HistoryFilters
        filters={filters}
        onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
        onSubmit={applyFilters}
        showOwner={user.role !== 'cliente'}
        isPetScoped={Boolean(selectedPet)}
        selectedPet={selectedPet}
      />

      <HistoryTable
        histories={histories}
        petById={petById}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onRefresh={() => loadHistories()}
        onViewDetail={showDetail}
      />
    </div>
  );
}

function HistoryDetail({ history, pet, onBack }) {
  const symptoms = Array.isArray(history.sintomas) ? history.sintomas : [];
  const healthData = history.datos_salud ?? {};
  const feeding = history.alimentacion ?? {};
  const behavior = history.comportamiento ?? {};

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
      </div>
    </div>
  );
}

function ClinicalHistoryForm({ pets, selectedPet, onCancel, onCreated }) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    id_mascota: selectedPet?.id ? String(selectedPet.id) : '',
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selected = pets.find((pet) => String(pet.id) === String(form.id_mascota)) ?? selectedPet;
  const canSubmit = form.id_mascota && form.tipo_registro && !isSubmitting;

  const update = (field, value) => {
    setError('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    const confirmed = window.confirm('Antes de guardar, confirma que todos los datos del historial clinico son correctos. Una vez creado no se podra modificar.');
    if (!confirmed) return;

    setIsSubmitting(true);
    setError('');

    try {
      const payload = buildPayload(form);
      const created = await pawlyticsApi.createClinicalHistory(payload);
      onCreated?.(created);
      setForm(initialForm);
    } catch {
      setError('No se pudo crear la historia clinica. Revisa los datos e intenta nuevamente.');
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
        <InputField label="Fecha de registro" type="date" value={form.fecha_registro} onChange={(value) => update('fecha_registro', value)} />
        <SelectField label="Tipo" value={form.tipo_registro} onChange={(value) => update('tipo_registro', value)} options={['sintomas', 'consulta', 'vacuna', 'tratamiento', 'control', 'otro']} />
        <InputField label="Peso kg" type="number" value={form.peso} onChange={(value) => update('peso', value)} />
        <InputField label="Temperatura" type="number" value={form.temperatura} onChange={(value) => update('temperatura', value)} />
        <InputField label="F. cardiaca" type="number" value={form.frecuencia_cardiaca} onChange={(value) => update('frecuencia_cardiaca', value)} />
        <InputField label="F. respiratoria" type="number" value={form.frecuencia_respiratoria} onChange={(value) => update('frecuencia_respiratoria', value)} />
        <SelectField
          label="Alimentacion"
          value={form.come_normal ? 'normal' : 'alterada'}
          onChange={(value) => update('come_normal', value === 'normal')}
          options={['normal', 'alterada']}
          labels={{ normal: 'Normal', alterada: 'Alterada' }}
        />
        <InputField label="Estado de animo" value={form.estado_animo} onChange={(value) => update('estado_animo', value)} />
        <SelectField label="Actividad" value={form.nivel_actividad} onChange={(value) => update('nivel_actividad', value)} options={['bajo', 'medio', 'alto']} />
        <InputField label="Sintoma" value={form.sintoma_nombre} onChange={(value) => update('sintoma_nombre', value)} />
        <SelectField label="Intensidad" value={form.sintoma_intensidad} onChange={(value) => update('sintoma_intensidad', value)} options={['baja', 'media', 'alta']} />
        <InputField label="Duracion" value={form.sintoma_duracion} onChange={(value) => update('sintoma_duracion', value)} />
        <InputField label="Frecuencia" value={form.sintoma_frecuencia} onChange={(value) => update('sintoma_frecuencia', value)} />
        <label className="md:col-span-3 text-sm font-semibold text-[#462255]">
          Detalle de alimentacion
          <textarea value={form.alimentacion_descripcion} onChange={(event) => update('alimentacion_descripcion', event.target.value)} rows={3} className="mt-2 w-full rounded-xl bg-gray-50 px-3 py-2" />
        </label>
        <label className="md:col-span-3 text-sm font-semibold text-[#462255]">
          Observaciones
          <textarea value={form.observaciones} onChange={(event) => update('observaciones', event.target.value)} rows={3} className="mt-2 w-full rounded-xl bg-gray-50 px-3 py-2" />
        </label>
      </div>

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

function HistoryFilters({ filters, onChange, onSubmit, showOwner, isPetScoped, selectedPet }) {
  const { typeOptions, breedOptions, isLoadingTypes, isLoadingBreeds } = usePetCatalogOptions(filters.typeId);

  const update = (field, value) => {
    onChange(field, value);

    if (field === 'typeId') {
      onChange('breedId', '');
    }
  };

  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow border border-[#7EE081]/20 md:grid-cols-5">
      <InputField label="Buscar historial" value={filters.search} onChange={(value) => onChange('search', value)} />
      {isPetScoped ? (
        <ReadOnlyFilterField
          label="Mascota"
          value={selectedPet ? `${selectedPet.name} - ${getOwnerName(selectedPet)}` : 'Mascota seleccionada'}
        />
      ) : (
        <>
          <InputField label="Mascota" value={filters.petName} onChange={(value) => onChange('petName', value)} />
          <SearchableSelect
            label="Tipo"
            value={filters.typeId}
            onChange={(value) => update('typeId', value)}
            options={typeOptions}
            placeholder={isLoadingTypes ? 'Cargando tipos...' : 'Todos'}
            searchPlaceholder="Buscar tipo..."
            emptyMessage="No se encontraron tipos."
            disabled={isLoadingTypes}
            clearable
          />
          <SearchableSelect
            label="Raza"
            value={filters.breedId}
            onChange={(value) => onChange('breedId', value)}
            options={breedOptions}
            placeholder={!filters.typeId ? 'Selecciona un tipo' : isLoadingBreeds ? 'Cargando razas...' : 'Todas'}
            searchPlaceholder="Buscar raza..."
            emptyMessage="No se encontraron razas."
            disabled={!filters.typeId || isLoadingBreeds}
            clearable
          />
          <SearchableSelect
            label="Sexo"
            value={filters.sex}
            onChange={(value) => onChange('sex', value)}
            options={[
              { value: 'Macho', label: 'Macho' },
              { value: 'Hembra', label: 'Hembra' },
            ]}
            placeholder="Todos"
            searchPlaceholder="Buscar sexo..."
            clearable
          />
          {showOwner && <InputField label="Propietario" value={filters.owner} onChange={(value) => onChange('owner', value)} />}
        </>
      )}
      <SearchableSelect
        label="Tipo registro"
        value={filters.recordType}
        onChange={(value) => onChange('recordType', value)}
        options={[
          { value: 'sintomas', label: 'Sintomas' },
          { value: 'consulta', label: 'Consulta' },
          { value: 'vacuna', label: 'Vacuna' },
          { value: 'tratamiento', label: 'Tratamiento' },
          { value: 'control', label: 'Control' },
          { value: 'otro', label: 'Otro' },
        ]}
        placeholder="Todos"
        searchPlaceholder="Buscar tipo..."
        clearable
      />
      <InputField label="Desde" type="date" value={filters.from} onChange={(value) => onChange('from', value)} />
      <InputField label="Hasta" type="date" value={filters.to} onChange={(value) => onChange('to', value)} />
      <button onClick={onSubmit} className="self-end rounded-xl bg-[#62A87C] px-4 py-2 font-bold text-[#462255]">
        Filtrar
      </button>
    </div>
  );
}

function HistoryTable({ histories, petById, isLoading, pagination, onPageChange, onRefresh, onViewDetail }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow border border-[#7EE081]/20">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-[#462255]">Registros</h2>
          <p className="text-sm text-[#313B72]">{pagination?.total ?? histories.length} historiales encontrados</p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-2 rounded-xl bg-[#313B72] px-4 py-2 font-semibold text-white">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#C3F3C0]/40 text-[#462255]">
            <tr>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Mascota</th>
              <th className="px-5 py-3">Propietario</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Observaciones</th>
              <th className="px-5 py-3">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="7" className="px-5 py-10 text-center text-[#313B72]">Cargando historial...</td></tr>
            ) : histories.length === 0 ? (
              <tr><td colSpan="7" className="px-5 py-10 text-center text-[#313B72]">No hay historiales registrados.</td></tr>
            ) : histories.map((history) => {
              const pet = petById[String(history.id_mascota)];
              return (
                <tr key={history.id} className="hover:bg-[#C3F3C0]/20">
                  <td className="px-5 py-4 text-sm">{formatDate(history.fecha_registro)}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#462255]">{pet?.name ?? history.id_mascota}</td>
                  <td className="px-5 py-4 text-sm">{pet ? getOwnerName(pet) : '-'}</td>
                  <td className="px-5 py-4 text-sm">{history.tipo_registro}</td>
                  <td className="px-5 py-4 text-sm">{history.estado}</td>
                  <td className="px-5 py-4 text-sm">{history.observaciones || '-'}</td>
                  <td className="px-5 py-4 text-sm">
                    <button
                      onClick={() => onViewDetail?.(history)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#313B72] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#462255]"
                    >
                      <Eye className="h-4 w-4" />
                      Ver detalle
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-[#313B72]">
        <span>Pagina {pagination?.page ?? 1} de {pagination?.totalPages ?? 1}</span>
        <div className="flex gap-2">
          <button onClick={() => onPageChange((pagination?.page ?? 1) - 1)} disabled={(pagination?.page ?? 1) <= 1 || isLoading} className="rounded-xl bg-gray-100 px-4 py-2 font-semibold disabled:opacity-50">Anterior</button>
          <button onClick={() => onPageChange((pagination?.page ?? 1) + 1)} disabled={(pagination?.page ?? 1) >= (pagination?.totalPages ?? 1) || isLoading} className="rounded-xl bg-[#C3F3C0]/60 px-4 py-2 font-semibold disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
}

function buildPayload(form) {
  const symptoms = form.sintoma_nombre.trim()
    ? [{
        nombre: form.sintoma_nombre.trim(),
        intensidad: form.sintoma_intensidad,
        duracion: form.sintoma_duracion.trim() || 'No especificada',
        frecuencia: form.sintoma_frecuencia.trim() || 'No especificada',
      }]
    : [];

  return {
    id_mascota: Number(form.id_mascota),
    fecha_registro: form.fecha_registro || undefined,
    tipo_registro: form.tipo_registro,
    sintomas: symptoms,
    datos_salud: {
      peso: emptyToUndefined(form.peso),
      temperatura: emptyToUndefined(form.temperatura),
      frecuencia_cardiaca: emptyToUndefined(form.frecuencia_cardiaca),
      frecuencia_respiratoria: emptyToUndefined(form.frecuencia_respiratoria),
    },
    alimentacion: {
      come_normal: form.come_normal,
      descripcion: form.alimentacion_descripcion.trim(),
    },
    comportamiento: {
      estado_animo: form.estado_animo.trim(),
      nivel_actividad: form.nivel_actividad,
    },
    observaciones: form.observaciones.trim(),
    estado: 'registrado',
  };
}

function emptyToUndefined(value) {
  return value === '' ? undefined : Number(value);
}

function InputField({ label, value, onChange, type = 'text' }) {
  return (
    <label className="text-sm font-semibold text-[#462255]">
      {label}
      <input value={value} type={type} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl bg-gray-50 px-3 py-2 text-[#313B72] outline-none focus:ring-2 focus:ring-[#7EE081]" />
    </label>
  );
}

function ReadOnlyFilterField({ label, value }) {
  return (
    <label className="text-sm font-semibold text-[#462255]">
      {label}
      <div className="mt-2 w-full truncate rounded-xl bg-[#C3F3C0]/35 px-3 py-2 text-[#313B72] ring-1 ring-[#7EE081]/30">
        {value || '-'}
      </div>
    </label>
  );
}

function ReadOnlyField({ label, value, className = '' }) {
  return (
    <div className={className}>
      <div className="text-sm font-semibold text-[#462255]">{label}</div>
      <div className="mt-2 min-h-10 rounded-xl bg-gray-50 px-3 py-2 text-sm text-[#313B72]">
        {value || '-'}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, labels = {} }) {
  return <SearchableSelect label={label} value={value} onChange={onChange} options={options.map((option) => ({ value: option, label: labels[option] ?? option }))} />;
}

function formatDate(date) {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-CO').format(new Date(date));
}

function formatMetric(value, unit) {
  if (value === undefined || value === null || value === '') {
    return '-';
  }

  return `${value} ${unit}`;
}
