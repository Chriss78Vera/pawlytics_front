import { SearchableSelect } from '@/app/components/selectors/SearchableSelect.jsx';
import { usePetCatalogOptions } from '@/app/components/selectors/usePetCatalogOptions.js';
import mascotasOptions from '@/app/assets/data/mascotasOptions.json';

export function MascotasFilters({ filters, onChange, onSubmit, showOwner = false }) {
  const { typeOptions, breedOptions, isLoadingTypes, isLoadingBreeds } = usePetCatalogOptions(filters.typeId);

  return (
    <div className={`grid gap-3 rounded-2xl bg-white p-4 shadow border border-[#7EE081]/20 ${showOwner ? 'md:grid-cols-6' : 'md:grid-cols-5'}`}>
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
        options={mascotasOptions.sexOptions}
        placeholder="Todos"
        searchPlaceholder="Buscar sexo..."
        clearable
      />
      {showOwner && <FilterInput label="Propietario" value={filters.owner} onChange={(value) => onChange('owner', value)} />}
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
