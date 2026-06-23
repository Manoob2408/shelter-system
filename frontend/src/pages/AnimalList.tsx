import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, X } from 'lucide-react';
import { AnimalSummary, Species, AnimalStatus } from '../types';
import { animalService } from '../services/animalService';
import { AnimalCard } from '../components/AnimalCard';
import { speciesLabel, statusLabel } from '../utils/helpers';

const SPECIES_OPTIONS: Species[] = ['DOG', 'CAT', 'RABBIT', 'BIRD', 'REPTILE', 'OTHER'];
const STATUS_OPTIONS: AnimalStatus[] = ['AVAILABLE', 'ADOPTED', 'UNDER_TREATMENT', 'RESERVED', 'DECEASED'];

export function AnimalList() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<AnimalSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [status, setStatus] = useState('');
  const [breed, setBreed] = useState('');

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const data = await animalService.getAll({ name: name || undefined, species: species || undefined, status: status || undefined, breed: breed || undefined });
      setAnimals(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnimals(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnimals();
  };

  const clearFilters = () => {
    setName(''); setSpecies(''); setStatus(''); setBreed('');
    setTimeout(fetchAnimals, 50);
  };

  const hasFilters = name || species || status || breed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Animais</h1>
          <p className="text-gray-500 mt-1">{animals.length} {animals.length === 1 ? 'animal cadastrado' : 'animais cadastrados'}</p>
        </div>
        <button
          onClick={() => navigate('/animals/new')}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Cadastrar animal
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="ml-auto text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <X className="w-3 h-3" />Limpar
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Raça"
            value={breed}
            onChange={e => setBreed(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={species}
            onChange={e => setSpecies(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Todas as espécies</option>
            {SPECIES_OPTIONS.map(s => <option key={s} value={s}>{speciesLabel[s]}</option>)}
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
          </select>
        </div>
        <button
          type="submit"
          className="mt-3 flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </form>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-40" />
          ))}
        </div>
      ) : animals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🐾</p>
          <h3 className="text-lg font-semibold text-gray-700">Nenhum animal encontrado</h3>
          <p className="text-gray-500 mt-1">Tente ajustar os filtros ou cadastre um novo animal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animals.map(a => (
            <AnimalCard key={a.id} animal={a} onClick={() => navigate(`/animals/${a.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
