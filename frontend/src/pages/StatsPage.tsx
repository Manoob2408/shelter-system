import { useEffect, useState } from 'react';
import { Stats } from '../types';
import { animalService } from '../services/animalService';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-32 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-3">
        <div className={`${color} h-3 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-8 text-right">{value}</span>
    </div>
  );
}

export function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => { animalService.getStats().then(setStats); }, []);

  if (!stats) return <div className="text-center py-16 text-gray-400">Carregando relatório...</div>;

  const statusData = [
    { label: 'Disponíveis', value: stats.available, color: 'bg-green-400' },
    { label: 'Adotados', value: stats.adopted, color: 'bg-blue-400' },
    { label: 'Em tratamento', value: stats.underTreatment, color: 'bg-orange-400' },
    { label: 'Reservados', value: stats.reserved, color: 'bg-purple-400' },
    { label: 'Outros', value: stats.totalAnimals - stats.available - stats.adopted - stats.underTreatment - stats.reserved, color: 'bg-gray-300' },
  ];

  const speciesData = [
    { label: '🐕 Cachorros', value: stats.dogs, color: 'bg-amber-400' },
    { label: '🐈 Gatos', value: stats.cats, color: 'bg-orange-400' },
    { label: '🐾 Outros', value: stats.others, color: 'bg-teal-400' },
  ];

  const adoptionRate = stats.totalAnimals > 0
    ? Math.round((stats.adopted / stats.totalAnimals) * 100)
    : 0;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-500 mt-1">Estatísticas gerais do abrigo</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.totalAnimals}</p>
          <p className="text-sm text-gray-500 mt-1">Total de animais</p>
        </div>
        <div className="bg-green-50 rounded-2xl border border-green-100 p-5 text-center">
          <p className="text-3xl font-bold text-green-700">{stats.available}</p>
          <p className="text-sm text-green-600 mt-1">Disponíveis</p>
        </div>
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 text-center">
          <p className="text-3xl font-bold text-blue-700">{adoptionRate}%</p>
          <p className="text-sm text-blue-600 mt-1">Taxa de adoção</p>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <BarChart3 className="w-4 h-4 text-green-600" />
          Por status
        </h2>
        <div className="space-y-4">
          {statusData.filter(d => d.value > 0).map(d => (
            <Bar key={d.label} label={d.label} value={d.value} max={stats.totalAnimals} color={d.color} />
          ))}
        </div>
      </div>

      {/* Species breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <PieChart className="w-4 h-4 text-green-600" />
          Por espécie
        </h2>
        <div className="space-y-4">
          {speciesData.map(d => (
            <Bar key={d.label} label={d.label} value={d.value} max={stats.totalAnimals} color={d.color} />
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-semibold">Destaques</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold">{stats.underTreatment}</p>
            <p className="text-sm text-green-100 mt-0.5">Em tratamento</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold">{stats.reserved}</p>
            <p className="text-sm text-green-100 mt-0.5">Aguardando adoção</p>
          </div>
        </div>
      </div>
    </div>
  );
}
