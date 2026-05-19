import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, UserPlus } from 'lucide-react';
import { pawlyticsApi } from '../../service/pawlyticsApi.js';

const VETERINARIO_ROLE_ID = 3;
const CLIENTE_ROLE_ID = 2;

const initialForm = {
  firstName: '',
  lastName: '',
  address: '',
  phone: '',
  identification: '',
  birthDate: '',
  email: '',
  password: '',
};

export function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await pawlyticsApi.getUsers();
      setUsers(Array.isArray(response) ? response : []);
    } catch {
      setUsers([]);
      setMessage('No se pudieron cargar los usuarios.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateForm = (field, value) => {
    setMessage('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createVeterinarian = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const userData = await pawlyticsApi.createUserData({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        identification: form.identification.trim(),
        birthDate: form.birthDate,
      });

      await pawlyticsApi.createUser({
        email: form.email.trim(),
        password: form.password,
        roleId: VETERINARIO_ROLE_ID,
        userDataId: userData.id,
        active: true,
      });

      setForm(initialForm);
      setMessage('Veterinario creado correctamente.');
      loadUsers();
    } catch {
      setMessage('No se pudo crear el veterinario. Revisa los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (user) => {
    if (!canToggleUser(user)) {
      setMessage('Solo se puede activar o desactivar clientes y veterinarios.');
      return;
    }

    try {
      const updated = await pawlyticsApi.updateUser(user.id, { active: !user.active });
      setUsers((current) => current.map((item) => item.id === user.id ? updated : item));
    } catch {
      setMessage('No se pudo actualizar el estado del usuario.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Usuarios</h1>
          <p className="text-[#313B72]">Administra veterinarios y el acceso de usuarios.</p>
        </div>
        <button
          onClick={loadUsers}
          className="px-5 py-3 bg-[#313B72] text-white rounded-xl font-semibold hover:bg-[#462255] transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {message && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#7EE081]/40 bg-[#C3F3C0]/30 px-5 py-4 text-[#313B72]">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{message}</span>
        </div>
      )}

      <form onSubmit={createVeterinarian} className="rounded-2xl bg-white p-5 shadow border border-[#7EE081]/20">
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
          <FormInput label="Nombre" value={form.firstName} onChange={(value) => updateForm('firstName', value)} />
          <FormInput label="Apellido" value={form.lastName} onChange={(value) => updateForm('lastName', value)} />
          <FormInput label="Identificacion" value={form.identification} onChange={(value) => updateForm('identification', value)} />
          <FormInput label="Fecha nacimiento" type="date" value={form.birthDate} onChange={(value) => updateForm('birthDate', value)} />
          <FormInput label="Direccion" value={form.address} onChange={(value) => updateForm('address', value)} />
          <FormInput label="Telefono" value={form.phone} onChange={(value) => updateForm('phone', value)} />
          <FormInput label="Email" type="email" value={form.email} onChange={(value) => updateForm('email', value)} />
          <FormInput label="Password" type="password" value={form.password} onChange={(value) => updateForm('password', value)} />
        </div>

        <button disabled={isSubmitting} className="mt-5 rounded-xl bg-[#62A87C] px-5 py-3 font-bold text-[#462255] disabled:opacity-50">
          {isSubmitting ? 'Creando...' : 'Crear veterinario'}
        </button>
      </form>

      <UsersTable users={users} isLoading={isLoading} onToggleActive={toggleActive} />
    </div>
  );
}

function UsersTable({ users, isLoading, onToggleActive }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow border border-[#7EE081]/20">
      <div className="border-b px-5 py-4">
        <h2 className="text-xl font-bold text-[#462255]">Listado de usuarios</h2>
        <p className="text-sm text-[#313B72]">{users.length} usuarios encontrados</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#C3F3C0]/40 text-[#462255]">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Accion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="5" className="px-5 py-10 text-center text-[#313B72]">Cargando usuarios...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="px-5 py-10 text-center text-[#313B72]">No hay usuarios registrados.</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-[#C3F3C0]/20">
                <td className="px-5 py-4 text-sm font-bold text-[#462255]">{getUserName(user)}</td>
                <td className="px-5 py-4 text-sm">{user.email}</td>
                <td className="px-5 py-4 text-sm">{user.role?.name ?? getRoleName(user.roleId)}</td>
                <td className="px-5 py-4 text-sm">
                  <span className={`rounded-full px-3 py-1 font-semibold ${user.active ? 'bg-[#C3F3C0] text-[#2F6B45]' : 'bg-red-100 text-red-700'}`}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm">
                  <button
                    onClick={() => onToggleActive(user)}
                    disabled={!canToggleUser(user)}
                    className="rounded-xl bg-[#313B72] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#462255] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {user.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = 'text' }) {
  return (
    <label className="text-sm font-semibold text-[#462255]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required
        className="mt-2 w-full rounded-xl bg-gray-50 px-3 py-2 text-[#313B72] outline-none focus:ring-2 focus:ring-[#7EE081]"
      />
    </label>
  );
}

function getUserName(user) {
  const firstName = user.userData?.firstName ?? '';
  const lastName = user.userData?.lastName ?? '';
  return `${firstName} ${lastName}`.trim() || '-';
}

function getRoleName(roleId) {
  if (roleId === 1) return 'Administrador';
  if (roleId === CLIENTE_ROLE_ID) return 'Cliente';
  if (roleId === VETERINARIO_ROLE_ID) return 'Veterinario';
  return '-';
}

function canToggleUser(user) {
  return user.roleId === CLIENTE_ROLE_ID || user.roleId === VETERINARIO_ROLE_ID;
}
