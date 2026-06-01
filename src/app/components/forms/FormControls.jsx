export function TextInput({ label, value, onChange, type = 'text', required = true, className = '', inputClassName = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold text-[#462255]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required={required}
        className={`mt-2 w-full rounded-2xl bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7EE081] ${inputClassName}`}
        {...props}
      />
    </label>
  );
}

export function TextAreaInput({ label, value, onChange, rows = 3, className = '', inputClassName = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold text-[#462255]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className={`mt-2 w-full resize-none rounded-2xl bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7EE081] ${inputClassName}`}
        {...props}
      />
    </label>
  );
}
