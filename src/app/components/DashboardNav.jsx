import { Brain, FileText, Home, LogOut, PawPrint, User, Users } from 'lucide-react';

const roleLabel = {
  admin: 'Administrador',
  veterinario: 'Veterinario',
  cliente: 'Cliente',
};

export function DashboardNav({ user, activeSection, canSeeAi, onNavigate, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, visible: true },
    { id: 'mascotas', label: 'Mascotas', icon: PawPrint, visible: user.role === 'admin' || user.role === 'cliente' || user.role === 'veterinario' },
    { id: 'historial', label: 'Historial', icon: FileText, visible: true },
    { id: 'usuarios', label: 'Usuarios', icon: Users, visible: user.role === 'admin' },
    { id: 'analisis', label: 'Analisis IA', icon: Brain, visible: canSeeAi, highlight: true },
  ];

  return (
    <aside className="h-screen w-72 flex-shrink-0 bg-[#462255] text-white flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7EE081] to-[#62A87C] flex items-center justify-center shadow-lg">
            <PawPrint className="w-6 h-6 text-[#462255]" />
          </div>
          <span className="text-2xl font-bold">Pawlytics</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.filter((item) => item.visible).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const className = isActive
              ? 'bg-[#7EE081] text-[#462255] font-semibold shadow-lg'
              : item.highlight
              ? 'hover:bg-white/10 bg-gradient-to-r from-[#7EE081]/20 to-[#62A87C]/20 border border-[#7EE081]/30'
              : 'hover:bg-white/10';

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${className}`}
              >
                <Icon className={`w-5 h-5 ${item.highlight && !isActive ? 'text-[#7EE081]' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7EE081] to-[#62A87C] flex items-center justify-center">
            <User className="w-5 h-5 text-[#462255]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{user.name}</div>
            <div className="text-xs text-white/60">{roleLabel[user.role]}</div>
          </div>
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Cerrar sesion">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
