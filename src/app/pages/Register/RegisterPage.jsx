import { useState } from 'react';
import { ArrowLeft, Calendar, Home, IdCard, Lock, Mail, Phone, User } from 'lucide-react';
import { IconTextInput } from '@/app/components/forms/IconTextInput.jsx';
import registerOptions from '@/app/assets/data/registerOptions.json';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';

export function RegisterPage({ onBack, onRegister }) {
  const [form, setForm] = useState(registerOptions.initialForm);
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
            <IconTextInput icon={User} label="Nombre" value={form.firstName} onChange={(value) => updateField('firstName', value)} />
            <IconTextInput icon={User} label="Apellido" value={form.lastName} onChange={(value) => updateField('lastName', value)} />
            <IconTextInput icon={Home} label="Direccion" value={form.address} onChange={(value) => updateField('address', value)} />
            <IconTextInput icon={Phone} label="Telefono" value={form.phone} onChange={(value) => updateField('phone', value)} />
            <IconTextInput icon={IdCard} label="Identificacion" value={form.identification} onChange={(value) => updateField('identification', value)} />
            <IconTextInput icon={Calendar} label="Fecha de nacimiento" type="date" value={form.birthDate} onChange={(value) => updateField('birthDate', value)} />
            <IconTextInput icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} />
            <IconTextInput icon={Lock} label="Contrasena" type="password" value={form.password} onChange={(value) => updateField('password', value)} />

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
