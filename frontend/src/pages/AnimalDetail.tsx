import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Syringe, AlertCircle, Calendar, Weight, Cpu, Heart, Tag, FileText } from 'lucide-react';
import { Animal } from '../types';
import { animalService } from '../services/animalService';
import {
  speciesEmoji, speciesLabel, statusLabel, statusColor,
  genderLabel, sizeLabel, formatAge, formatDate,
  diseaseSatusLabel, diseaseStatusColor
} from '../utils/helpers';

export function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    animalService.getById(Number(id)).then(setAnimal).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!animal?.id || !confirm(`Remover ${animal.name} do sistema?`)) return;
    setDeleting(true);
    await animalService.delete(animal.id);
    navigate('/animals');
  };

  if (loading) return <div className="text-center py-16 text-gray-400">Carregando...</div>;
  if (!animal) return <div className="text-center py-16 text-gray-400">Animal não encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/animals')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />Voltar
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/animals/${animal.id}/edit`)}
            className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4" />Editar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 border border-red-200 hover:bg-red-50 text-red-600 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />{deleting ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="w-full h-56 bg-amber-50 relative">
          {animal.photoUrl ? (
              <img
                  src={animal.photoUrl}
                  alt={animal.name}
                  className="w-full h-full object-cover"
              />
          ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl opacity-25">
                {speciesEmoji[animal.species]}
              </div>
          )}
        </div>
      </div>
        <div className="p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-4xl">
            {speciesEmoji[animal.species]}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{animal.name}</h1>
                <p className="text-gray-500">{animal.breed} · {speciesLabel[animal.species]}</p>
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${statusColor[animal.status]}`}>
                {statusLabel[animal.status]}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
              {animal.gender && <span className="bg-gray-50 px-2.5 py-1 rounded-lg">{genderLabel[animal.gender]}</span>}
              {animal.size && <span className="bg-gray-50 px-2.5 py-1 rounded-lg">{sizeLabel[animal.size]}</span>}
              {(animal.ageYears || animal.ageMonths) && <span className="bg-gray-50 px-2.5 py-1 rounded-lg">{formatAge(animal.ageYears ?? undefined, animal.ageMonths ?? undefined)}</span>}
              {animal.color && <span className="bg-gray-50 px-2.5 py-1 rounded-lg">🎨 {animal.color}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4">
        <InfoCard icon={Calendar} label="Entrada no abrigo" value={formatDate(animal.entryDate ?? undefined)} />
        {animal.adoptionDate && <InfoCard icon={Heart} label="Data de adoção" value={formatDate(animal.adoptionDate)} />}
        {animal.weight && <InfoCard icon={Weight} label="Peso" value={`${animal.weight} kg`} />}
        {animal.microchipped && <InfoCard icon={Cpu} label="Microchip" value={animal.microchipNumber || 'Sim'} />}
        <InfoCard icon={Tag} label="Castrado" value={animal.castrated ? 'Sim' : 'Não'} />
      </div>

      {/* Description */}
      {(animal.description || animal.temperament || animal.specialNeeds || animal.observations) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" />Descrição
          </h2>
          {animal.description && <p className="text-gray-600 text-sm leading-relaxed">{animal.description}</p>}
          {animal.temperament && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Temperamento</p>
              <p className="text-gray-700 text-sm">{animal.temperament}</p>
            </div>
          )}
          {animal.specialNeeds && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
              <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Necessidades especiais</p>
              <p className="text-orange-800 text-sm">{animal.specialNeeds}</p>
            </div>
          )}
          {animal.observations && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Observações</p>
              <p className="text-gray-700 text-sm">{animal.observations}</p>
            </div>
          )}
        </div>
      )}

      {/* Vaccines */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Syringe className="w-4 h-4 text-blue-500" />
          Vacinas ({animal.vaccines.length})
        </h2>
        {animal.vaccines.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhuma vacina registrada.</p>
        ) : (
          <div className="space-y-3">
            {animal.vaccines.map(v => (
              <div key={v.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{v.name}</p>
                  {v.applicationDate && (
                    <span className="text-xs text-gray-400">{formatDate(v.applicationDate)}</span>
                  )}
                </div>
                {v.manufacturer && <p className="text-xs text-gray-500">{v.manufacturer}{v.lot && ` · Lote: ${v.lot}`}</p>}
                {v.veterinarian && <p className="text-xs text-gray-500 mt-1">Vet: {v.veterinarian}</p>}
                {v.nextDoseDate && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">Próxima dose: {formatDate(v.nextDoseDate)}</p>
                )}
                {v.notes && <p className="text-xs text-gray-500 mt-1 italic">{v.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Diseases */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          Doenças / Condições ({animal.diseases.length})
        </h2>
        {animal.diseases.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhuma doença registrada.</p>
        ) : (
          <div className="space-y-3">
            {animal.diseases.map(d => (
              <div key={d.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{d.name}</p>
                  {d.status && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diseaseStatusColor[d.status]}`}>
                      {diseaseSatusLabel[d.status]}
                    </span>
                  )}
                </div>
                {d.description && <p className="text-xs text-gray-600 mb-1">{d.description}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {d.diagnosisDate && <span>Diagnóstico: {formatDate(d.diagnosisDate)}</span>}
                  {d.recoveryDate && <span>Recuperação: {formatDate(d.recoveryDate)}</span>}
                  {d.veterinarian && <span>Vet: {d.veterinarian}</span>}
                </div>
                {d.treatment && (
                  <div className="mt-2 bg-blue-50 rounded-lg p-2.5">
                    <p className="text-xs font-medium text-blue-700">Tratamento</p>
                    <p className="text-xs text-blue-600 mt-0.5">{d.treatment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
