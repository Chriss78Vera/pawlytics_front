import { SearchableSelect } from '@/app/components/selectors/SearchableSelect.jsx';
import { usePetCatalogOptions } from '@/app/components/selectors/usePetCatalogOptions.js';
import { getOwnerName } from '@/app/pages/Mascotas/shared/mascotasUtils.js';
import clinicalHistoryOptions from '@/app/assets/data/clinicalHistoryOptions.json';
import { InputField, ReadOnlyFilterField } from './FormFields.jsx';

export function HistoryFilters({ filters, onChange, onSubmit, showOwner, isPetScoped, selectedPet }) {
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
            options={clinicalHistoryOptions.sexOptions}
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
        options={clinicalHistoryOptions.recordTypes}
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
