import { AlertCircle, RefreshCw } from 'lucide-react';
import { useUsersManagement } from '@/app/hooks/useUsersManagement.js';
import { UsersTable } from './components/UsersTable.jsx';
import { VeterinarianForm } from './components/VeterinarianForm.jsx';

export function UsuariosPage() {
  const {
    users,
    form,
    updateForm,
    isLoading,
    isSubmitting,
    message,
    loadUsers,
    createVeterinarian,
    toggleActive,
  } = useUsersManagement();

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

      <VeterinarianForm
        form={form}
        isSubmitting={isSubmitting}
        onChange={updateForm}
        onSubmit={createVeterinarian}
      />

      <UsersTable users={users} isLoading={isLoading} onToggleActive={toggleActive} />
    </div>
  );
}
