import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Heart, Stethoscope, CheckCircle, TrendingUp } from 'lucide-react';
import { Stats, AnimalSummary } from '../types';
import { animalService } from '../services/animalService';
import { AnimalCard } from '../components/AnimalCard';

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<AnimalSummary[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    animalService.getStats().then(setStats);
    animalService.getAll().then(data => setRecent(data.slice(0, 6)));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do abrigo PataFeliz</p>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={PawPrint} label="Total de animais" value={stats.totalAnimals} color="bg-green-50 text-green-600" />
          <StatCard icon={Heart} label="Disponíveis" value={stats.available} color="bg-emerald-50 text-emerald-600" />
          <StatCard icon={CheckCircle} label="Adotados" value={stats.adopted} color="bg-blue-50 text-blue-600" />
          <StatCard icon={Stethoscope} label="Em tratamento" value={stats.underTreatment} color="bg-orange-50 text-orange-600" />
        </div>
      )}

      {/* Species split */}
      {stats && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Animais por espécie
          </h2>
          <div className="flex gap-6">
            {[
              { label: '🐕 Cachorros', value: stats.dogs },
              { label: '🐈 Gatos', value: stats.cats },
              { label: '🐾 Outros', value: stats.others },
            ].map(item => (
              <div key={item.label} className="flex-1 bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent animals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Animais recentes</h2>
          <button
            onClick={() => navigate('/animals')}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Ver todos →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recent.map(a => (
            <AnimalCard key={a.id} animal={a} onClick={() => navigate(`/animals/${a.id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
}
