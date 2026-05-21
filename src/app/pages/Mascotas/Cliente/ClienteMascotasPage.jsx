import { useState } from 'react';
import { AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { MascotaForm } from '@/app/pages/Mascotas/components/MascotaForm';
import { useNotifications } from '@/app/context/NotificationsContext.jsx';
import { useMascotasList } from '@/app/hooks/useMascotasList.js';
import { MascotasFilters } from '@/app/pages/Mascotas/shared/MascotasFilters.jsx';
import { MascotasTable } from '@/app/pages/Mascotas/shared/MascotasTable.jsx';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';
import { DiagnosticosMascota } from './DiagnosticosMascota.jsx';

export function ClienteMascotasPage({
  user,
  initialView = 'list',
  onHistory,
  title = 'Mascotas',
  description = 'Estas son tus mascotas registradas.',
}) {
  const [view, setView] = useState(initialView);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const { notify } = useNotifications();
  const {
    mascotas,
    filters,
    updateFilter,
    setPage,
    pagination,
    isLoading,
    errorMessage,
    loadMascotas,
    applyFilters,
    prependMascota,
  } = useMascotasList({ mode: 'client', userDataId: user.userDataId });

  const handleMascotaCreated = (createdMascota) => {
    prependMascota(createdMascota);
    setView('list');
    notify({
      title: 'Mascota registrada',
      message: 'La mascota se creo correctamente.',
      type: 'success',
    });
  };

  const downloadClinicalReport = async (mascota) => {
    const reportWindow = window.open('', '_blank');

    try {
      if (!reportWindow) {
        throw new Error('El navegador bloqueo la ventana del reporte.');
      }

      reportWindow.document.write('<p style="font-family: Arial; padding: 24px;">Generando reporte Pawlytics...</p>');
      const response = await fetch(pawlyticsApi.getMascotaClinicalReportUrl(mascota.id));

      if (!response.ok) {
        throw new Error('No se pudo generar el reporte.');
      }

      const html = await response.text();

      reportWindow.document.open();
      reportWindow.document.write(html);
      reportWindow.document.close();
      reportWindow.focus();
      setTimeout(() => reportWindow.print(), 500);

      notify({
        title: 'Reporte listo',
        message: `El reporte de ${mascota.name} esta listo para guardar como PDF.`,
        type: 'success',
      });
    } catch (error) {
      reportWindow?.close();
      notify({
        title: 'Error al generar reporte',
        message: error.message || 'No se pudo descargar el reporte clinico.',
        type: 'error',
      });
    }
  };

  if (view === 'create') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">Agregar mascota</h1>
          <p className="text-[#313B72]">Registra una nueva mascota para mantener su salud siempre al dia.</p>
        </div>
        <MascotaForm
          userDataId={user.userDataId}
          onCancel={() => setView('list')}
          onCreated={handleMascotaCreated}
        />
      </div>
    );
  }

  if (view === 'diagnosis' && selectedMascota) {
    return (
      <DiagnosticosMascota
        mascota={selectedMascota}
        onBack={() => {
          setSelectedMascota(null);
          setView('list');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#462255]">{title}</h1>
          <p className="text-[#313B72]">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadMascotas()}
            className="px-5 py-3 bg-[#313B72] text-white rounded-xl font-semibold hover:bg-[#462255] transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={() => setView('create')}
            className="px-5 py-3 bg-gradient-to-r from-[#7EE081] to-[#62A87C] text-[#462255] rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar mascota
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </div>
      )}

      <MascotasFilters filters={filters} onChange={updateFilter} onSubmit={applyFilters} />

      <MascotasTable
        mascotas={mascotas}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onHistory={onHistory}
        onDiagnosis={(mascota) => {
          setSelectedMascota(mascota);
          setView('diagnosis');
        }}
        onDownloadReport={downloadClinicalReport}
      />
    </div>
  );
}
