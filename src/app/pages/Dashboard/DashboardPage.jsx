import { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Brain,
  FileText,
  PawPrint,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardHeader } from '../../components/DashboardHeader.jsx';
import { DashboardNav } from '../../components/DashboardNav.jsx';
import { MascotasPage } from '../Mascotas/MascotasPage.jsx';
import { HistorialPage } from '../Historial/HistorialPage.jsx';
import { UsuariosPage } from '../Usuarios/UsuariosPage.jsx';
import { pawlyticsApi } from '../../service/pawlyticsApi.js';

const can = {
  seeAi: (role) => role === 'admin' || role === 'veterinario',
  managePets: (role) => role === 'admin',
  manageHistory: (role) => role === 'veterinario',
};

const emptySummary = {
  metrics: {
    totalPets: 0,
    healthAlerts: 0,
    recentConsultations: 0,
    totalHistories: 0,
  },
  weightData: [],
  symptomsData: [],
  owners: [],
};

export function DashboardPage({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedHistoryPet, setSelectedHistoryPet] = useState(null);
  const canSeeAi = can.seeAi(user.role);
  const canManagePets = can.managePets(user.role);
  const canManageHistory = can.manageHistory(user.role);
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
  const [summary, setSummary] = useState(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setErrorMessage('');

    pawlyticsApi.getDashboardSummary({ role: user.role, userDataId: user.userDataId })
      .then((response) => {
        if (!isActive) return;

        setSummary({
          ...emptySummary,
          ...response,
          metrics: {
            ...emptySummary.metrics,
            ...(response?.metrics ?? {}),
          },
        });
      })
      .catch(() => {
        if (!isActive) return;
        setSummary(emptySummary);
        setErrorMessage('No se pudieron cargar las metricas actualizadas.');
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [user.role, user.userDataId]);

  const metrics = summary.metrics;
  const weightData = summary.weightData.length ? summary.weightData : [{ month: 'Sin datos', peso: 0 }];
  const symptomsData = summary.symptomsData.length ? summary.symptomsData : [{ symptom: 'Sin datos', count: 0 }];

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

function MetricCard({ icon: Icon, value, label, featured = false }) {
  if (featured) {
    return (
      <div className="bg-gradient-to-br from-[#7EE081] to-[#62A87C] rounded-3xl p-6 shadow-xl text-[#462255] hover:scale-105 transition-transform">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-4xl font-bold mb-1">{value}</div>
        <div className="text-sm opacity-90">{label}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#7EE081]/20 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#7EE081] to-[#62A87C] rounded-2xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#462255]" />
        </div>
      </div>
      <div className="text-4xl font-bold text-[#462255] mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function AiAnalysisCard({ totalHistories, healthAlerts }) {
  return (
    <div className="bg-gradient-to-br from-[#462255] to-[#313B72] rounded-3xl p-6 text-white shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#7EE081] rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#462255]" />
        </div>
        <h3 className="font-bold text-lg">Resumen clinico</h3>
      </div>
      <div className="space-y-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm"><strong>{totalHistories}</strong> historiales disponibles para analisis.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm"><strong>{healthAlerts}</strong> registros con sintomas de intensidad alta.</p>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <h3 className="font-bold text-[#462255] mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#62A87C]" />
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function formatMetricValue(value, isLoading) {
  if (isLoading) {
    return '...';
  }

  return String(value ?? 0);
}
