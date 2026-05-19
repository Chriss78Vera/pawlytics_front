import { AdminMascotasPage } from './Administradores/AdminMascotasPage.jsx';
import { ClienteMascotasPage } from './Cliente/ClienteMascotasPage.jsx';

export function MascotasPage({ user, initialView = 'list', onHistory }) {
  if (user?.role === 'cliente') {
    return <ClienteMascotasPage user={user} initialView={initialView} onHistory={onHistory} />;
  }

  return <AdminMascotasPage user={user} onHistory={onHistory} />;
}
