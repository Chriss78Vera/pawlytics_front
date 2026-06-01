import { ResponsiveContainer } from 'recharts';

export function ChartCard({ title, icon: Icon, children }) {
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
