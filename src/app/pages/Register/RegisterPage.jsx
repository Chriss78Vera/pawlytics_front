import { useState } from 'react';
import { ArrowLeft, Calendar, Home, IdCard, Lock, Mail, Phone, User } from 'lucide-react';
import { pawlyticsApi } from '../../service/pawlyticsApi.js';

const initialForm = {
  firstName: 'Christopher',
  lastName: 'Vera',
  address: 'Av. Principal 123',
  phone: '0999999999',
  identification: '1723456789',
  birthDate: '2000-05-15',
  email: '',
  password: '',
};

export function RegisterPage({ onBack, onRegister }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await pawlyticsApi.registerClient(form);

      onRegister(response.user);
    } catch {
      onRegister({
        email: form.email,
        role: 'cliente',
        name: `${form.firstName} ${form.lastName}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#C3F3C0]/20 to-[#7EE081]/10 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-[#313B72] hover:text-[#462255] font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al login
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] p-8 shadow-2xl border border-[#7EE081]/20">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#462255]">Registro de cliente</h1>
            <p className="text-[#313B72]">Los nuevos usuarios se registran siempre con rol cliente.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <FormInput icon={User} label="Nombre" value={form.firstName} onChange={(value) => updateField('firstName', value)} />
            <FormInput icon={User} label="Apellido" value={form.lastName} onChange={(value) => updateField('lastName', value)} />
            <FormInput icon={Home} label="Dirección" value={form.address} onChange={(value) => updateField('address', value)} />
            <FormInput icon={Phone} label="Teléfono" value={form.phone} onChange={(value) => updateField('phone', value)} />
            <FormInput icon={IdCard} label="Identificación" value={form.identification} onChange={(value) => updateField('identification', value)} />
            <FormInput icon={Calendar} label="Fecha de nacimiento" type="date" value={form.birthDate} onChange={(value) => updateField('birthDate', value)} />
            <FormInput icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} />
            <FormInput icon={Lock} label="Contraseña" type="password" value={form.password} onChange={(value) => updateField('password', value)} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 w-full px-8 py-4 bg-gradient-to-r from-[#7EE081] to-[#62A87C] text-[#462255] rounded-2xl shadow-xl shadow-[#7EE081]/30 hover:shadow-2xl transition-all duration-300 font-bold disabled:opacity-70"
            >
              {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormInput({ icon: Icon, label, value, onChange, type = 'text' }) {
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
        />
      </div>
    </label>
  );
}
