import { Sparkles } from 'lucide-react';

export function MetricCard({ icon: Icon, value, label, featured = false }) {
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
