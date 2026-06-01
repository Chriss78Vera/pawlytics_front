import { UserPlus } from 'lucide-react';
import { TextInput } from '@/app/components/forms/FormControls.jsx';

export function VeterinarianForm({ form, isSubmitting, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-5 shadow border border-[#7EE081]/20">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C3F3C0]">
          <UserPlus className="h-5 w-5 text-[#462255]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#462255]">Crear veterinario</h2>
          <p className="text-sm text-[#313B72]">El administrador solo puede crear usuarios veterinarios.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <TextInput label="Nombre" value={form.firstName} onChange={(value) => onChange('firstName', value)} inputClassName="rounded-xl px-3 py-2" />
        <TextInput label="Apellido" value={form.lastName} onChange={(value) => onChange('lastName', value)} inputClassName="rounded-xl px-3 py-2" />
        <TextInput label="Identificacion" value={form.identification} onChange={(value) => onChange('identification', value)} inputClassName="rounded-xl px-3 py-2" />
        <TextInput label="Fecha nacimiento" type="date" value={form.birthDate} onChange={(value) => onChange('birthDate', value)} inputClassName="rounded-xl px-3 py-2" />
        <TextInput label="Direccion" value={form.address} onChange={(value) => onChange('address', value)} inputClassName="rounded-xl px-3 py-2" />
        <TextInput label="Telefono" value={form.phone} onChange={(value) => onChange('phone', value)} inputClassName="rounded-xl px-3 py-2" />
        <TextInput label="Email" type="email" value={form.email} onChange={(value) => onChange('email', value)} inputClassName="rounded-xl px-3 py-2" />
        <TextInput label="Password" type="password" value={form.password} onChange={(value) => onChange('password', value)} inputClassName="rounded-xl px-3 py-2" />
      </div>

      <button disabled={isSubmitting} className="mt-5 rounded-xl bg-[#62A87C] px-5 py-3 font-bold text-[#462255] disabled:opacity-50">
        {isSubmitting ? 'Creando...' : 'Crear veterinario'}
      </button>
    </form>
  );
}
