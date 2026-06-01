import { Bell, Plus } from 'lucide-react';
import { useNotifications } from '@/app/context/NotificationsContext.jsx';

export function DashboardHeader({ canManagePets, canManageHistory, onCreatePet, onCreateHistory }) {
  const { notifications, isOpen, setIsOpen, clearNotifications } = useNotifications();
  const unreadCount = notifications.length;

  return (
    <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-10">
      <div className="px-8 py-5 flex items-center justify-between">
        <div className="flex-1">
          <div>
            <p className="text-sm font-semibold text-[#62A87C]">Centro clinico Pawlytics</p>
            <h2 className="text-xl font-bold text-[#462255]">Gestion y seguimiento veterinario</h2>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-6">
          <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7EE081] px-1 text-xs font-bold text-[#462255]">
                {unreadCount}
              </span>
            )}
          </button>
          {isOpen && (
            <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-[#7EE081]/20 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <span className="font-bold text-[#462255]">Notificaciones</span>
                {notifications.length > 0 && (
                  <button type="button" onClick={clearNotifications} className="text-xs font-bold text-[#313B72] hover:text-[#462255]">
                    Limpiar
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto p-3">
                {notifications.length === 0 ? (
                  <p className="rounded-xl bg-gray-50 px-4 py-5 text-center text-sm text-[#313B72]">Sin notificaciones.</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`rounded-xl border px-4 py-3 text-sm ${
                        notification.type === 'error'
                          ? 'border-red-100 bg-red-50 text-red-700'
                          : 'border-[#7EE081]/30 bg-[#C3F3C0]/20 text-[#313B72]'
                      }`}>
                        <div className="font-bold">{notification.title}</div>
                        <div>{notification.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
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
