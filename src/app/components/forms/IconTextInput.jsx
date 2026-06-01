export function IconTextInput({ icon: Icon, label, value, onChange, type = 'text', ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#462255]">{label}</span>
      <div className="relative mt-2">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#62A87C]" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          required
          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7EE081]"
          {...props}
        />
      </div>
    </label>
  );
}
