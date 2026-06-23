export type Species = 'DOG' | 'CAT' | 'RABBIT' | 'BIRD' | 'REPTILE' | 'OTHER';
export type Gender = 'MALE' | 'FEMALE';
export type Size = 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
export type AnimalStatus = 'AVAILABLE' | 'ADOPTED' | 'UNDER_TREATMENT' | 'RESERVED' | 'DECEASED';
export type DiseaseStatus = 'ACTIVE' | 'RECOVERED' | 'CHRONIC' | 'CONTROLLED';

export interface Vaccine {
  id?: number;
  name: string;
  applicationDate?: string;
  nextDoseDate?: string;
  veterinarian?: string;
  lot?: string;
  manufacturer?: string;
  notes?: string;
  animalId?: number;
}

export interface Disease {
  id?: number;
  name: string;
  description?: string;
  diagnosisDate?: string;
  recoveryDate?: string;
  status?: DiseaseStatus;
  treatment?: string;
  veterinarian?: string;
  notes?: string;
  animalId?: number;
}

export interface AnimalSummary {
  id: number;
  name: string;
  species: Species;
  breed: string;
  ageYears?: number;
  ageMonths?: number;
  gender?: Gender;
  size?: Size;
  status: AnimalStatus;
  color?: string;
  photoUrl?: string;
  vaccineCount: number;
  diseaseCount: number;
}

export interface Animal {
  id?: number;
  name: string;
  species: Species;
  breed: string;
  ageYears?: number;
  ageMonths?: number;
  gender?: Gender;
  size?: Size;
  status: AnimalStatus;
  description?: string;
  observations?: string;
  weight?: number;
  color?: string;
  entryDate?: string;
  adoptionDate?: string;
  castrated?: boolean;
  microchipped?: boolean;
  microchipNumber?: string;
  temperament?: string;
  specialNeeds?: string;
  photoUrl?: string;
  vaccines: Vaccine[];
  diseases: Disease[];
}

export interface Stats {
  totalAnimals: number;
  available: number;
  adopted: number;
  underTreatment: number;
  reserved: number;
  dogs: number;
  cats: number;
  others: number;
}
