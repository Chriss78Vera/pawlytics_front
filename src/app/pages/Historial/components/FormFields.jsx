import { SearchableSelect } from '@/app/components/selectors/SearchableSelect.jsx';

export function InputField({ label, value, onChange, type = 'text', inputClassName = '', ...props }) {
  return (
    <label className="text-sm font-semibold text-[#462255]">
      {label}
      <input
        value={value}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-xl bg-gray-50 px-3 py-2 text-[#313B72] outline-none focus:ring-2 focus:ring-[#7EE081] disabled:cursor-not-allowed disabled:opacity-60 ${inputClassName}`}
        {...props}
      />
    </label>
  );
}

export function TextareaField({ label, value, onChange, rows = 3, className = '', inputClassName = 'bg-gray-50' }) {
  return (
    <label className={`text-sm font-semibold text-[#462255] ${className}`}>
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className={`mt-2 w-full rounded-xl px-3 py-2 ${inputClassName}`}
      />
    </label>
  );
}

export function ReadOnlyFilterField({ label, value }) {
  return (
    <label className="text-sm font-semibold text-[#462255]">
      {label}
      <div className="mt-2 w-full truncate rounded-xl bg-[#C3F3C0]/35 px-3 py-2 text-[#313B72] ring-1 ring-[#7EE081]/30">
        {value || '-'}
      </div>
    </label>
  );
}

export function ReadOnlyField({ label, value, className = '' }) {
  return (
    <div className={className}>
      <div className="text-sm font-semibold text-[#462255]">{label}</div>
      <div className="mt-2 min-h-10 rounded-xl bg-gray-50 px-3 py-2 text-sm text-[#313B72]">
        {value || '-'}
      </div>
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return <SearchableSelect label={label} value={value} onChange={onChange} options={options} />;
}
