import { Activity, Brain, ChevronRight, PawPrint, Sparkles, Users } from 'lucide-react';

export function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#C3F3C0]/20 to-[#7EE081]/10">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7EE081]/5 via-transparent to-[#62A87C]/5" />

        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7EE081] to-[#62A87C] flex items-center justify-center shadow-lg shadow-[#7EE081]/30">
              <PawPrint className="w-7 h-7 text-[#462255]" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-[#462255] to-[#313B72] bg-clip-text text-transparent">
              Pawlytics
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                <span className="text-[#462255]">Cuida, analiza y</span>{' '}
                <span className="bg-gradient-to-r from-[#7EE081] to-[#62A87C] bg-clip-text text-transparent">
                  entiende
                </span>{' '}
                <span className="text-[#462255]">la salud de tus mascotas</span>
              </h1>

              <p className="text-xl text-[#313B72] mb-10 leading-relaxed">
                Gestiona mascotas, historiales clínicos y análisis inteligentes en una sola plataforma.
              </p>

              <button
                onClick={onStart}
                className="group px-8 py-4 bg-gradient-to-r from-[#7EE081] to-[#62A87C] text-[#462255] rounded-2xl shadow-xl shadow-[#7EE081]/30 hover:shadow-2xl hover:shadow-[#7EE081]/40 transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105"
              >
                Comenzar ahora
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7EE081]/30 to-[#62A87C]/30 rounded-[3rem] blur-3xl" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-[3rem] p-10 shadow-2xl border border-[#7EE081]/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 p-6 bg-gradient-to-br from-[#7EE081] to-[#62A87C] rounded-3xl text-[#462255]">
                    <Sparkles className="w-8 h-8 mb-3" />
                    <div className="text-3xl font-bold">156</div>
                    <div className="text-sm opacity-90">Mascotas saludables</div>
                  </div>
                  <div className="p-6 bg-[#C3F3C0] rounded-3xl">
                    <Activity className="w-7 h-7 text-[#462255] mb-2" />
                    <div className="text-2xl font-bold text-[#462255]">98%</div>
                    <div className="text-xs text-[#313B72]">Precisión IA</div>
                  </div>
                  <div className="p-6 bg-[#313B72] rounded-3xl text-white">
                    <Brain className="w-7 h-7 mb-2" />
                    <div className="text-2xl font-bold">2.4k</div>
                    <div className="text-xs opacity-80">Análisis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
