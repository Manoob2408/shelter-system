import { Syringe, AlertCircle } from 'lucide-react';
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { AnimalSummary } from '../types';
import { speciesEmoji, speciesLabel, statusColor, statusLabel, genderLabel, formatAge } from '../utils/helpers';

interface Props {
  animal: AnimalSummary;
  onClick: () => void;
}

export function AnimalCard({ animal, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Photo banner */}
      <div className="w-full h-36 bg-amber-50 relative overflow-hidden">
        {animal.photoUrl ? (
            <img
                src={animal.photoUrl}
                alt={animal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
              {speciesEmoji[animal.species]}
            </div>
        )}
        <span className={`absolute top-2 right-2 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${statusColor[animal.status]}`}>
          {statusLabel[animal.status]}
        </span>
      </div>

      <div className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">
            {speciesEmoji[animal.species]}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{animal.name}</h3>
            <p className="text-sm text-gray-500">{animal.breed} · {speciesLabel[animal.species]}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor[animal.status]}`}>
          {statusLabel[animal.status]}
        </span>
      </div>

      {/* Info */}
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        {animal.gender && (
          <span className="flex items-center gap-1">
            {animal.gender === 'MALE'
              ? <IoMdMale  className="w-3.5 h-3.5 text-blue-400" />
              : <IoMdFemale className="w-3.5 h-3.5 text-pink-400" />}
            {genderLabel[animal.gender]}
          </span>
        )}
        {(animal.ageYears || animal.ageMonths) && (
          <span className="text-gray-300">·</span>
        )}
        <span>{formatAge(animal.ageYears ?? undefined, animal.ageMonths ?? undefined)}</span>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center">
            <Syringe className="w-3 h-3 text-blue-500" />
          </div>
          <span>{animal.vaccineCount} vacina{animal.vaccineCount !== 1 ? 's' : ''}</span>
        </div>
        {animal.diseaseCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <div className="w-5 h-5 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-3 h-3 text-red-400" />
            </div>
            <span>{animal.diseaseCount} doença{animal.diseaseCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        {animal.color && (
          <span className="ml-auto text-xs text-gray-400">{animal.color}</span>
        )}
      </div>
    </div>
    </div>
  );
}
