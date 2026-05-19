import { Bell, Plus, Search } from 'lucide-react';

export function DashboardHeader({ canManagePets, canManageHistory, onCreatePet, onCreateHistory }) {
  return (
    <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-10">
      <div className="px-8 py-5 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar mascotas, propietarios o historiales..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7EE081] transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 ml-6">
          <button className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#7EE081] rounded-full" />
          </button>
          {canManagePets && (
            <button onClick={onCreatePet} className="px-6 py-3 bg-gradient-to-r from-[#7EE081] to-[#62A87C] text-[#462255] rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nueva mascota
            </button>
          )}
          {canManageHistory && (
            <button onClick={onCreateHistory} className="px-6 py-3 bg-[#313B72] text-white rounded-xl font-semibold hover:bg-[#462255] transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nuevo historial
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
