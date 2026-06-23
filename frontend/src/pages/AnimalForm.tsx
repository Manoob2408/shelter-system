import { useEffect, useState, useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Camera, X } from 'lucide-react';
import { Animal, Vaccine, Disease, Species, AnimalStatus, Gender, Size, DiseaseStatus } from '../types';
import { animalService } from '../services/animalService';
import { speciesLabel, statusLabel, genderLabel, sizeLabel, diseaseSatusLabel,speciesEmoji } from '../utils/helpers';

const emptyAnimal: Omit<Animal, 'id'> = {
  name: '', species: 'DOG', breed: '', status: 'AVAILABLE',
  vaccines: [], diseases: [],
};

const emptyVaccine: Vaccine = { name: '' };
const emptyDisease: Disease = { name: '' };

function Input({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        {...props}
        required={required}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
      />
    </div>
  );
}

function Select({ label, required, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <select
        {...props}
        required={required}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-shadow"
      >
        {children}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-shadow"
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">{children}</h2>;
}

// Photo uploader component — converts file to base64 data URL stored in photoUrl
function PhotoUploader({ value, species, onChange }: {
  value?: string;
  species: Species;
  onChange: (url: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Foto do animal
        </label>
        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
        />

        {value ? (
            // Preview mode
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50" style={{ height: 220 }}>
              <img
                  src={value}
                  alt="Foto do animal"
                  className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center gap-3 opacity-0 hover:opacity-100">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-2 bg-white text-gray-900 px-3 py-2 rounded-xl text-sm font-medium shadow"
                >
                  <Camera className="w-4 h-4" />
                  Trocar foto
                </button>
                <button
                    type="button"
                    onClick={() => onChange(undefined)}
                    className="flex items-center gap-2 bg-white text-red-600 px-3 py-2 rounded-xl text-sm font-medium shadow"
                >
                  <X className="w-4 h-4" />
                  Remover
                </button>
              </div>
            </div>
        ) : (
            // Drop zone
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-green-400 hover:bg-green-50/40 transition-all"
                style={{ height: 180 }}
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-4xl opacity-60">
                {speciesEmoji[species]}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1.5 justify-center">
                  <Camera className="w-4 h-4 text-green-500" />
                  Clique ou arraste uma foto
                </p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG ou WEBP · salvo localmente</p>
              </div>
            </div>
        )}
      </div>
  );
}

export function AnimalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<Omit<Animal, 'id'>>(emptyAnimal);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;
    animalService.getById(Number(id)).then(data => {
      const { id: _id, ...rest } = data;
      setForm(rest);
    }).finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (key: keyof Omit<Animal, 'id'>, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && id) {
        await animalService.update(Number(id), form);
        navigate(`/animals/${id}`);
      } else {
        const created = await animalService.create(form);
        navigate(`/animals/${created.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  // Vaccine handlers
  const addVaccine = () => set('vaccines', [...form.vaccines, { ...emptyVaccine }]);
  const updateVaccine = (i: number, key: keyof Vaccine, value: string) => {
    const updated = [...form.vaccines];
    updated[i] = { ...updated[i], [key]: value };
    set('vaccines', updated);
  };
  const removeVaccine = (i: number) => set('vaccines', form.vaccines.filter((_, idx) => idx !== i));

  // Disease handlers
  const addDisease = () => set('diseases', [...form.diseases, { ...emptyDisease }]);
  const updateDisease = (i: number, key: keyof Disease, value: string) => {
    const updated = [...form.diseases];
    updated[i] = { ...updated[i], [key]: value };
    set('diseases', updated);
  };
  const removeDisease = (i: number) => set('diseases', form.diseases.filter((_, idx) => idx !== i));

  if (loading) return <div className="text-center py-16 text-gray-400">Carregando...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar animal' : 'Cadastrar animal'}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{isEdit ? 'Atualize as informações do animal' : 'Preencha os dados do novo animal'}</p>
        </div>
      </div>

      {/* Foto */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <PhotoUploader
            value={form.photoUrl ?? undefined}
            species={form.species}
            onChange={url => set('photoUrl', url)}
        />
      </div>

      {/* Identificação */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <SectionTitle>Identificação</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nome" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nome do animal" />
          <Select label="Espécie" required value={form.species} onChange={e => set('species', e.target.value as Species)}>
            {(['DOG', 'CAT', 'RABBIT', 'BIRD', 'REPTILE', 'OTHER'] as Species[]).map(s => (
              <option key={s} value={s}>{speciesLabel[s]}</option>
            ))}
          </Select>
          <Input label="Raça" required value={form.breed ?? ''} onChange={e => set('breed', e.target.value)} placeholder="Ex: Labrador, Siamês..." />
          <Select label="Status" value={form.status} onChange={e => set('status', e.target.value as AnimalStatus)}>
            {(['AVAILABLE', 'ADOPTED', 'UNDER_TREATMENT', 'RESERVED', 'DECEASED'] as AnimalStatus[]).map(s => (
              <option key={s} value={s}>{statusLabel[s]}</option>
            ))}
          </Select>
          <Select label="Sexo" value={form.gender ?? ''} onChange={e => set('gender', e.target.value as Gender || undefined)}>
            <option value="">Não informado</option>
            {(['MALE', 'FEMALE'] as Gender[]).map(g => <option key={g} value={g}>{genderLabel[g]}</option>)}
          </Select>
          <Select label="Porte" value={form.size ?? ''} onChange={e => set('size', e.target.value as Size || undefined)}>
            <option value="">Não informado</option>
            {(['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'] as Size[]).map(s => <option key={s} value={s}>{sizeLabel[s]}</option>)}
          </Select>
          <Input label="Cor / Pelagem" value={form.color ?? ''} onChange={e => set('color', e.target.value)} placeholder="Ex: Preto e branco" />
          <Input label="Peso (kg)" type="number" step="0.1" min="0" value={form.weight ?? ''} onChange={e => set('weight', e.target.value ? Number(e.target.value) : undefined)} placeholder="Ex: 5.5" />
        </div>

        {/* Age */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Idade — Anos" type="number" min="0" value={form.ageYears ?? ''} onChange={e => set('ageYears', e.target.value ? Number(e.target.value) : undefined)} placeholder="0" />
          <Input label="Idade — Meses" type="number" min="0" max="11" value={form.ageMonths ?? ''} onChange={e => set('ageMonths', e.target.value ? Number(e.target.value) : undefined)} placeholder="0" />
        </div>
      </div>

      {/* Datas e microchip */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <SectionTitle>Datas e Microchip</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Data de entrada" type="date" value={form.entryDate ?? ''} onChange={e => set('entryDate', e.target.value || undefined)} />
          <Input label="Data de adoção" type="date" value={form.adoptionDate ?? ''} onChange={e => set('adoptionDate', e.target.value || undefined)} />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.castrated ?? false} onChange={e => set('castrated', e.target.checked)}
              className="w-4 h-4 rounded accent-green-600" />
            <span className="text-sm text-gray-700">Castrado(a)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.microchipped ?? false} onChange={e => set('microchipped', e.target.checked)}
              className="w-4 h-4 rounded accent-green-600" />
            <span className="text-sm text-gray-700">Microchipado(a)</span>
          </label>
        </div>
        {form.microchipped && (
          <Input label="Número do microchip" value={form.microchipNumber ?? ''} onChange={e => set('microchipNumber', e.target.value)} placeholder="Ex: 985141001234567" />
        )}
      </div>

      {/* Descrição */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <SectionTitle>Descrição e Comportamento</SectionTitle>
        <Textarea label="Descrição" value={form.description ?? ''} onChange={e => set('description', e.target.value)} placeholder="Conte um pouco sobre a história do animal..." />
        <Textarea label="Temperamento" value={form.temperament ?? ''} onChange={e => set('temperament', e.target.value)} placeholder="Ex: Dócil, brincalhão, tímido..." />
        <Textarea label="Necessidades especiais" value={form.specialNeeds ?? ''} onChange={e => set('specialNeeds', e.target.value)} placeholder="Medicações, restrições alimentares..." />
        <Textarea label="Observações gerais" value={form.observations ?? ''} onChange={e => set('observations', e.target.value)} placeholder="Outras informações relevantes..." />
      </div>

      {/* Vacinas */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <SectionTitle>Vacinas</SectionTitle>
          <button type="button" onClick={addVaccine} className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium">
            <Plus className="w-4 h-4" />Adicionar
          </button>
        </div>
        {form.vaccines.length === 0 && <p className="text-sm text-gray-400">Nenhuma vacina cadastrada.</p>}
        {form.vaccines.map((v, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Vacina {i + 1}</span>
              <button type="button" onClick={() => removeVaccine(i)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nome da vacina" required value={v.name} onChange={e => updateVaccine(i, 'name', e.target.value)} placeholder="Ex: V10, Antirrábica..." />
              <Input label="Fabricante" value={v.manufacturer ?? ''} onChange={e => updateVaccine(i, 'manufacturer', e.target.value)} placeholder="Ex: Zoetis" />
              <Input label="Data de aplicação" type="date" value={v.applicationDate ?? ''} onChange={e => updateVaccine(i, 'applicationDate', e.target.value)} />
              <Input label="Próxima dose" type="date" value={v.nextDoseDate ?? ''} onChange={e => updateVaccine(i, 'nextDoseDate', e.target.value)} />
              <Input label="Veterinário" value={v.veterinarian ?? ''} onChange={e => updateVaccine(i, 'veterinarian', e.target.value)} placeholder="Nome do veterinário" />
              <Input label="Número do lote" value={v.lot ?? ''} onChange={e => updateVaccine(i, 'lot', e.target.value)} placeholder="Ex: ABC123" />
            </div>
          </div>
        ))}
      </div>

      {/* Doenças */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <SectionTitle>Doenças / Condições de Saúde</SectionTitle>
          <button type="button" onClick={addDisease} className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium">
            <Plus className="w-4 h-4" />Adicionar
          </button>
        </div>
        {form.diseases.length === 0 && <p className="text-sm text-gray-400">Nenhuma doença cadastrada.</p>}
        {form.diseases.map((d, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Condição {i + 1}</span>
              <button type="button" onClick={() => removeDisease(i)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nome da doença" required value={d.name} onChange={e => updateDisease(i, 'name', e.target.value)} placeholder="Ex: Leishmaniose, FIV..." />
              <Select label="Status" value={d.status ?? ''} onChange={e => updateDisease(i, 'status', e.target.value as DiseaseStatus)}>
                <option value="">Não informado</option>
                {(['ACTIVE', 'RECOVERED', 'CHRONIC', 'CONTROLLED'] as DiseaseStatus[]).map(s => (
                  <option key={s} value={s}>{diseaseSatusLabel[s]}</option>
                ))}
              </Select>
              <Input label="Data do diagnóstico" type="date" value={d.diagnosisDate ?? ''} onChange={e => updateDisease(i, 'diagnosisDate', e.target.value)} />
              <Input label="Data de recuperação" type="date" value={d.recoveryDate ?? ''} onChange={e => updateDisease(i, 'recoveryDate', e.target.value)} />
              <Input label="Veterinário" value={d.veterinarian ?? ''} onChange={e => updateDisease(i, 'veterinarian', e.target.value)} placeholder="Nome do veterinário" />
            </div>
            <Textarea label="Descrição" value={d.description ?? ''} onChange={e => updateDisease(i, 'description', e.target.value)} placeholder="Descreva a condição..." />
            <Textarea label="Tratamento" value={d.treatment ?? ''} onChange={e => updateDisease(i, 'treatment', e.target.value)} placeholder="Medicações, procedimentos..." />
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium text-sm transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar animal'}
        </button>
      </div>
    </form>
  );
}
