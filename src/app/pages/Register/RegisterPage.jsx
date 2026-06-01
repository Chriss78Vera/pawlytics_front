import { useState } from 'react';
import { AlertCircle, ArrowLeft, Calendar, Home, IdCard, Lock, Mail, Phone, User } from 'lucide-react';
import { IconTextInput } from '@/app/components/forms/IconTextInput.jsx';
import registerOptions from '@/app/assets/data/registerOptions.json';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';
import { validateRegisterForm } from '@/app/functions/formValidations.js';

export function RegisterPage({ onBack, onRegister }) {
  const [form, setForm] = useState(registerOptions.initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field, value) => {
    const nextValue = ['identification', 'phone'].includes(field)
      ? value.replace(/\D/g, '')
      : value;

    setErrorMessage('');
    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const validationErrors = validateRegisterForm(form);
    if (validationErrors.length) {
      setErrorMessage(validationErrors.join(' '));
      return;
    }

    setIsSubmitting(true);

    try {
      const { user, userData } = await pawlyticsApi.registerClient(form);
      const storedLogin = {
        userId: user.id,
        roleId: user.roleId,
        userDataId: user.userDataId,
        email: user.email,
      };

      localStorage.setItem('pawlytics_login', JSON.stringify(storedLogin));

      onRegister({
        email: user.email,
        role: 'cliente',
        userId: user.id,
        userDataId: user.userDataId,
        userData,
        name: `${userData.firstName} ${userData.lastName}`.trim(),
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message ?? 'No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#C3F3C0]/20 to-[#7EE081]/10 flex items-center justify-center p-6">
      {errorMessage && (
        <div className="fixed right-6 top-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-red-200 bg-white px-5 py-4 text-red-700 shadow-2xl">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Error</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

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
            <IconTextInput
              icon={Phone}
              label="Telefono"
              value={form.phone}
              onChange={(value) => updateField('phone', value)}
              inputMode="numeric"
              maxLength={9}
              pattern="[0-9]{9}"
            />
            <IconTextInput
              icon={IdCard}
              label="Identificacion"
              value={form.identification}
              onChange={(value) => updateField('identification', value)}
              inputMode="numeric"
              maxLength={10}
              pattern="[0-9]{10}"
            />
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
