import { useEffect, useState } from 'react';
import { AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { MascotaForm } from '../../../components/MascotaForm.jsx';
import { pawlyticsApi } from '../../../service/pawlyticsApi.js';
import { fallbackMascotas, normalizeMascotas, normalizePagination } from '../shared/mascotasUtils.js';
import { MascotasTable } from '../shared/MascotasTable.jsx';
import { SearchableSelect } from '../../../components/selectors/SearchableSelect.jsx';
import { usePetCatalogOptions } from '../../../components/selectors/usePetCatalogOptions.js';

const initialFilters = {
  search: '',
  typeId: '',
  breedId: '',
  sex: '',
};

export function ClienteMascotasPage({ user, initialView = 'list', onHistory }) {
  const [view, setView] = useState(initialView);
  const [mascotas, setMascotas] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(normalizePagination());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadMascotas = async (nextPage = page) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await pawlyticsApi.getMascotasByUserData(user.userDataId, { page: nextPage, limit: 5, filters });
      const items = normalizeMascotas(response);
      setMascotas(items);
      setPagination(normalizePagination(response, items.length));
    } catch {
      setMascotas(fallbackMascotas);
      setPagination(normalizePagination(null, fallbackMascotas.length));
      setErrorMessage('No se pudo cargar la informacion actualizada.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMascotas();
  }, [user.userDataId, page]);

  const handleMascotaCreated = (createdMascota) => {
    const createdItems = normalizeMascotas(createdMascota);

    if (createdItems.length) {
      setMascotas((current) => [...createdItems, ...current].slice(0, 5));
    } else {
      loadMascotas(1);
    }

    setPage(1);
    setView('list');
  };

  const updateFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      ...(field === 'typeId' ? { breedId: '' } : {}),
    }));
  };

  const applyFilters = () => {
    setPage(1);
    loadMascotas(1);
  };

  if (view === 'create') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Agregar mascota</h1>
          <p className="text-[#313B72]">Registra una nueva mascota para mantener su salud siempre al dia.</p>
        </div>
        <MascotaForm
          userDataId={user.userDataId}
          onCancel={() => setView('list')}
          onCreated={handleMascotaCreated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Mascotas</h1>
          <p className="text-[#313B72]">Estas son tus mascotas registradas.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadMascotas()}
            className="px-5 py-3 bg-[#313B72] text-white rounded-xl font-semibold hover:bg-[#462255] transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={() => setView('create')}
            className="px-5 py-3 bg-gradient-to-r from-[#7EE081] to-[#62A87C] text-[#462255] rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar mascota
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </div>
      )}

      <MascotasFilters filters={filters} onChange={updateFilter} onSubmit={applyFilters} />

      <MascotasTable
        mascotas={mascotas}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onHistory={onHistory}
      />
    </div>
  );
}

function MascotasFilters({ filters, onChange, onSubmit }) {
  const { typeOptions, breedOptions, isLoadingTypes, isLoadingBreeds } = usePetCatalogOptions(filters.typeId);

  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow border border-[#7EE081]/20 md:grid-cols-5">
      <FilterInput label="Nombre" value={filters.search} onChange={(value) => onChange('search', value)} />
      <SearchableSelect
        label="Tipo"
        value={filters.typeId}
        onChange={(value) => onChange('typeId', value)}
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
      <button onClick={onSubmit} className="self-end rounded-xl bg-[#62A87C] px-4 py-2 font-bold text-[#462255]">
        Filtrar
      </button>
    </div>
  );
}

function FilterInput({ label, value, onChange }) {
  return (
    <label className="text-sm font-semibold text-[#462255]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl bg-gray-50 px-3 py-2 text-[#313B72] outline-none focus:ring-2 focus:ring-[#7EE081]"
      />
    </label>
  );
}
