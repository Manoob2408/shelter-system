import { Species, AnimalStatus, Gender, Size, DiseaseStatus } from '../types';

export const speciesLabel: Record<Species, string> = {
  DOG: 'Cachorro',
  CAT: 'Gato',
  RABBIT: 'Coelho',
  BIRD: 'Pássaro',
  REPTILE: 'Réptil',
  OTHER: 'Outro',
};

export const speciesEmoji: Record<Species, string> = {
  DOG: '🐕',
  CAT: '🐈',
  RABBIT: '🐇',
  BIRD: '🐦',
  REPTILE: '🦎',
  OTHER: '🐾',
};

export const statusLabel: Record<AnimalStatus, string> = {
  AVAILABLE: 'Disponível',
  ADOPTED: 'Adotado',
  UNDER_TREATMENT: 'Em tratamento',
  RESERVED: 'Reservado',
  DECEASED: 'Falecido',
};

export const statusColor: Record<AnimalStatus, string> = {
  AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
  ADOPTED: 'bg-blue-100 text-blue-800 border-blue-200',
  UNDER_TREATMENT: 'bg-orange-100 text-orange-800 border-orange-200',
  RESERVED: 'bg-purple-100 text-purple-800 border-purple-200',
  DECEASED: 'bg-gray-100 text-gray-600 border-gray-200',
};

export const genderLabel: Record<Gender, string> = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
};

export const sizeLabel: Record<Size, string> = {
  SMALL: 'Pequeno',
  MEDIUM: 'Médio',
  LARGE: 'Grande',
  EXTRA_LARGE: 'Muito grande',
};

export const diseaseSatusLabel: Record<DiseaseStatus, string> = {
  ACTIVE: 'Ativo',
  RECOVERED: 'Recuperado',
  CHRONIC: 'Crônico',
  CONTROLLED: 'Controlado',
};

export const diseaseStatusColor: Record<DiseaseStatus, string> = {
  ACTIVE: 'bg-red-100 text-red-700',
  RECOVERED: 'bg-green-100 text-green-700',
  CHRONIC: 'bg-orange-100 text-orange-700',
  CONTROLLED: 'bg-blue-100 text-blue-700',
};

export function formatAge(years?: number, months?: number): string {
  if (!years && !months) return 'Idade desconhecida';
  const parts = [];
  if (years) parts.push(`${years} ano${years > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} ${months > 1 ? 'meses' : 'mês'}`);
  return parts.join(' e ');
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}
