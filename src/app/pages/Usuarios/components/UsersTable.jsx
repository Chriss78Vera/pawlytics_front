import { canToggleUser, getRoleName, getUserName } from '@/app/functions/userUtils.js';

export function UsersTable({ users, isLoading, onToggleActive }) {
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
