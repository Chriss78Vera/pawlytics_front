import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  FileText,
  PawPrint,
  TrendingUp,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardHeader } from '@/app/components/DashboardHeader.jsx';
import { DashboardNav } from '@/app/components/DashboardNav.jsx';
import { MascotasPage } from '@/app/pages/Mascotas/MascotasPage.jsx';
import { HistorialPage } from '@/app/pages/Historial/HistorialPage.jsx';
import { UsuariosPage } from '@/app/pages/Usuarios/UsuariosPage.jsx';
import dashboardOptions from '@/app/assets/data/dashboardOptions.json';
import { dashboardPermissions, formatMetricValue } from '@/app/functions/dashboardUtils.js';
import { useDashboardSummary } from '@/app/hooks/useDashboardSummary.js';
import { AiAnalysisCard } from './components/AiAnalysisCard.jsx';
import { ChartCard } from './components/ChartCard.jsx';
import { MetricCard } from './components/MetricCard.jsx';

export function DashboardPage({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedHistoryPet, setSelectedHistoryPet] = useState(null);
  const canSeeAi = dashboardPermissions.seeAi(user.role);
  const canManagePets = dashboardPermissions.managePets(user.role);
  const canManageHistory = dashboardPermissions.manageHistory(user.role);
  const isCreatingHistory = activeSection === 'historial-create'
    || (activeSection === 'historial' && user.role === 'veterinario' && selectedHistoryPet);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#C3F3C0]/10 via-white to-[#7EE081]/5 flex">
      <DashboardNav
        user={user}
        activeSection={
          activeSection.startsWith('mascotas')
            ? 'mascotas'
            : activeSection.startsWith('historial')
            ? 'historial'
            : activeSection
        }
        canSeeAi={canSeeAi}
        onNavigate={(section) => {
          setSelectedHistoryPet(null);
          setActiveSection(section);
        }}
        onLogout={onLogout}
      />

      <main className="min-w-0 flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          canManagePets={canManagePets}
          canManageHistory={canManageHistory && !isCreatingHistory}
          onCreatePet={() => setActiveSection('mascotas-create')}
          onCreateHistory={() => {
            setSelectedHistoryPet(null);
            setActiveSection('historial-create');
          }}
        />

        <div className="flex-1 overflow-y-auto p-8">
          {activeSection === 'mascotas' ? (
            <MascotasPage
              user={user}
              onHistory={(pet) => {
                setSelectedHistoryPet(pet);
                setActiveSection('historial');
              }}
            />
          ) : activeSection === 'mascotas-create' ? (
            <MascotasPage user={user} initialView="create" />
          ) : activeSection === 'historial' ? (
            <HistorialPage user={user} selectedPet={selectedHistoryPet} />
          ) : activeSection === 'historial-create' ? (
            <HistorialPage user={user} selectedPet={selectedHistoryPet} initialView="create" />
          ) : activeSection === 'usuarios' && user.role === 'admin' ? (
            <UsuariosPage />
          ) : (
            <DashboardHome user={user} canSeeAi={canSeeAi} />
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardHome({ user, canSeeAi }) {
  const { summary, isLoading, errorMessage } = useDashboardSummary(user);
  const metrics = summary.metrics;
  const weightData = summary.weightData.length ? summary.weightData : dashboardOptions.fallbackWeightData;
  const symptomsData = summary.symptomsData.length ? summary.symptomsData : dashboardOptions.fallbackSymptomsData;

  return (
    <>
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={PawPrint} value={formatMetricValue(metrics.totalPets, isLoading)} label="Mascotas registradas" />
        <MetricCard icon={AlertCircle} value={formatMetricValue(metrics.healthAlerts, isLoading)} label="Alertas de salud" featured />
        <MetricCard icon={Activity} value={formatMetricValue(metrics.recentConsultations, isLoading)} label="Consultas recientes" />
        <MetricCard icon={FileText} value={formatMetricValue(metrics.totalHistories, isLoading)} label="Historiales disponibles" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ChartCard title="Peso promedio (kg)" icon={TrendingUp}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C3F3C0" />
              <XAxis dataKey="month" stroke="#313B72" fontSize={12} />
              <YAxis stroke="#313B72" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #7EE081', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="peso" stroke="#7EE081" strokeWidth={3} dot={{ fill: '#62A87C', r: 5 }} />
            </LineChart>
          </ChartCard>

          <ChartCard title="Sintomas frecuentes" icon={Activity}>
            <BarChart data={symptomsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C3F3C0" />
              <XAxis dataKey="symptom" stroke="#313B72" fontSize={11} />
              <YAxis stroke="#313B72" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #7EE081', borderRadius: '12px' }} />
              <Bar dataKey="count" fill="#7EE081" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>

        <div className="space-y-6">
          {canSeeAi && <AiAnalysisCard totalHistories={metrics.totalHistories} healthAlerts={metrics.healthAlerts} />}
        </div>
      </div>
    </>
  );
}
