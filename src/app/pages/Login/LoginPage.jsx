import { useState } from 'react';
import { AlertCircle, ArrowLeft, Lock, Mail, PawPrint } from 'lucide-react';
import { pawlyticsApi } from '../../service/pawlyticsApi.js';

const roleById = {
  1: 'admin',
  2: 'cliente',
  3: 'veterinario',
};

const getLoginUserDataId = (loginResponse) => {
  return loginResponse.userData ?? loginResponse.userDat ?? loginResponse.userDataId;
};

const getErrorMessage = (error) => {
  if (!error.response) {
    return 'Error con la conexión, intente más tarde';
  }

  const status = error.response.status;
  const apiMessage = error.response.data?.message ?? error.response.data?.error ?? '';

  if (status === 403 && apiMessage.toLowerCase().includes('inactivo')) {
    return 'Usuario inactivo. Contacta al administrador.';
  }

  if (status === 401 || apiMessage.toLowerCase().includes('contraseña')) {
    return 'Contraseña incorrecta';
  }

  return 'Error con la conexión, intente más tarde';
};

export function LoginPage({ onBack, onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isLoginDisabled = isSubmitting || !email.trim() || !password.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoginDisabled) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const loginResponse = await pawlyticsApi.login({ email, password });
      const userDataId = getLoginUserDataId(loginResponse);
      const userData = await pawlyticsApi.getUserData(userDataId);
      const role = roleById[loginResponse.roleId] ?? 'cliente';
      const storedLogin = {
        ...loginResponse,
        email,
      };

      localStorage.setItem('pawlytics_login', JSON.stringify(storedLogin));

      onLogin({
        email,
        role,
        userId: loginResponse.userId,
        userDataId,
        userData,
        name: `${userData.firstName} ${userData.lastName}`,
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
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

      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-[#313B72] hover:text-[#462255] font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] p-8 shadow-2xl border border-[#7EE081]/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7EE081] to-[#62A87C] flex items-center justify-center shadow-lg">
              <PawPrint className="w-7 h-7 text-[#462255]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#462255]">Iniciar sesión</h1>
              <p className="text-sm text-[#313B72]">Accede a Pawlytics</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-[#462255]">Email</span>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#62A87C]" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  placeholder="correo@pawlytics.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7EE081]"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#462255]">Contraseña</span>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#62A87C]" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                  placeholder="********"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7EE081]"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoginDisabled}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#7EE081] to-[#62A87C] text-[#462255] rounded-2xl shadow-xl shadow-[#7EE081]/30 hover:shadow-2xl transition-all duration-300 font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <button
            onClick={onRegister}
            className="w-full mt-4 px-8 py-4 bg-[#313B72] text-white rounded-2xl hover:bg-[#462255] transition-all duration-300 font-semibold shadow-lg"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}
