import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.jsx';
import { cn } from '../ui/utils.js';

export function normalizeSelectOptions(items, { includeAll = false, allLabel = 'Todos' } = {}) {
  const normalizedItems = normalizeList(items)
    .map((item) => ({
      value: item.value ?? item.id ?? item.TIP_ID ?? item.RAZ_ID,
      label: item.label ?? item.name ?? item.nombre ?? item.TIP_NOMBRE ?? item.RAZ_NOMBRE,
    }))
    .filter((item) => item.value !== undefined && item.label);

  if (!includeAll) {
    return normalizedItems;
  }

  return [{ value: '', label: allLabel }, ...normalizedItems];
}

export function normalizeList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecciona una opcion',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No se encontraron resultados.',
  disabled = false,
  clearable = false,
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => String(option.value) === String(value));
  const selectedLabel = selectedOption?.label ?? selectedOption?.value;

  return (
    <div className="block min-w-0">
      {label && <span className="text-sm font-semibold text-[#462255]">{label}</span>}
      <div className="relative mt-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              aria-expanded={open}
              className={cn(
                'flex min-h-10 w-full items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2 text-left text-[#313B72] transition-all focus:outline-none focus:ring-2 focus:ring-[#7EE081]',
                disabled && 'cursor-not-allowed opacity-60',
                !selectedOption && 'text-gray-500',
                clearable && selectedOption && 'pr-10'
              )}
            >
              <span className="min-w-0 flex-1 truncate">{selectedLabel ?? placeholder}</span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#313B72]/60" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-2xl border-[#7EE081]/30 p-0 shadow-xl"
          >
            <Command className="rounded-2xl">
              <CommandInput
                placeholder={searchPlaceholder}
                className="h-11 text-[#313B72] placeholder:text-[#313B72]/50"
              />
              <CommandList className={cn('max-h-[260px] overflow-y-auto p-1', options.length > 6 && 'min-h-[180px]')}>
                <CommandEmpty className="py-8 text-center text-sm text-[#313B72]/70">
                  {emptyMessage}
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const optionValue = String(option.value);
                    const optionLabel = option.label ?? optionValue;
                    const isSelected = optionValue === String(value);

                    return (
                      <CommandItem
                        key={`${optionValue}-${optionLabel}`}
                        value={optionLabel}
                        keywords={[optionValue]}
                        onSelect={() => {
                          onChange(String(option.value));
                          setOpen(false);
                        }}
                        className="min-h-10 cursor-pointer rounded-xl px-3 py-2 text-[#313B72] data-[selected=true]:bg-[#C3F3C0]/60 data-[selected=true]:text-[#462255]"
                      >
                        <span className="min-w-0 flex-1 truncate">{optionLabel}</span>
                        <Check className={cn('h-4 w-4 text-[#62A87C]', isSelected ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {clearable && selectedOption && !disabled && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#313B72]/60 hover:bg-[#C3F3C0]/70 hover:text-[#462255]"
            title="Limpiar seleccion"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
