package com.shelter.service;

import com.shelter.dto.AnimalDTO;
import com.shelter.dto.DiseaseDTO;
import com.shelter.dto.StatsDTO;
import com.shelter.dto.VaccineDTO;
import com.shelter.model.Animal;
import com.shelter.model.Disease;
import com.shelter.model.Vaccine;
import com.shelter.repository.AnimalRepository;
import com.shelter.repository.DiseaseRepository;
import com.shelter.repository.VaccineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final VaccineRepository vaccineRepository;
    private final DiseaseRepository diseaseRepository;

    public List<AnimalDTO.Summary> findAll(String name, Animal.Species species, Animal.Status status, String breed) {
        return animalRepository.findByFilters(name, species, status, breed)
                .stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    public AnimalDTO.Response findById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + id));
        return toResponse(animal);
    }

    @Transactional
    public AnimalDTO.Response create(AnimalDTO.Request request) {
        Animal animal = toEntity(request);
        animal = animalRepository.save(animal);

        if (request.getVaccines() != null) {
            Animal finalAnimal = animal;
            List<Vaccine> vaccines = request.getVaccines().stream()
                    .map(v -> toVaccineEntity(v, finalAnimal))
                    .collect(Collectors.toList());
            vaccineRepository.saveAll(vaccines);
            animal.setVaccines(vaccines);
        }

        if (request.getDiseases() != null) {
            Animal finalAnimal = animal;
            List<Disease> diseases = request.getDiseases().stream()
                    .map(d -> toDiseaseEntity(d, finalAnimal))
                    .collect(Collectors.toList());
            diseaseRepository.saveAll(diseases);
            animal.setDiseases(diseases);
        }

        return toResponse(animalRepository.findById(animal.getId()).orElseThrow());
    }

    @Transactional
    public AnimalDTO.Response update(Long id, AnimalDTO.Request request) {
        Animal existing = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + id));

        updateEntity(existing, request);

        vaccineRepository.deleteByAnimalId(id);
        diseaseRepository.deleteByAnimalId(id);

        if (request.getVaccines() != null) {
            List<Vaccine> vaccines = request.getVaccines().stream()
                    .map(v -> toVaccineEntity(v, existing))
                    .collect(Collectors.toList());
            vaccineRepository.saveAll(vaccines);
        }

        if (request.getDiseases() != null) {
            List<Disease> diseases = request.getDiseases().stream()
                    .map(d -> toDiseaseEntity(d, existing))
                    .collect(Collectors.toList());
            diseaseRepository.saveAll(diseases);
        }

        animalRepository.save(existing);
        return toResponse(animalRepository.findById(id).orElseThrow());
    }

    @Transactional
    public void delete(Long id) {
        if (!animalRepository.existsById(id)) {
            throw new RuntimeException("Animal not found with id: " + id);
        }
        vaccineRepository.deleteByAnimalId(id);
        diseaseRepository.deleteByAnimalId(id);
        animalRepository.deleteById(id);
    }

    public StatsDTO getStats() {
        long total = animalRepository.count();
        long available = animalRepository.countByStatus(Animal.Status.AVAILABLE);
        long adopted = animalRepository.countByStatus(Animal.Status.ADOPTED);
        long underTreatment = animalRepository.countByStatus(Animal.Status.UNDER_TREATMENT);
        long reserved = animalRepository.countByStatus(Animal.Status.RESERVED);
        long dogs = animalRepository.countBySpecies(Animal.Species.DOG);
        long cats = animalRepository.countBySpecies(Animal.Species.CAT);
        long others = total - dogs - cats;

        return new StatsDTO(total, available, adopted, underTreatment, reserved, dogs, cats, others);
    }

    private Animal toEntity(AnimalDTO.Request req) {
        Animal a = new Animal();
        updateEntity(a, req);
        return a;
    }

    private void updateEntity(Animal a, AnimalDTO.Request req) {
        a.setName(req.getName());
        a.setSpecies(req.getSpecies());
        a.setBreed(req.getBreed());
        a.setAgeYears(req.getAgeYears());
        a.setAgeMonths(req.getAgeMonths());
        a.setGender(req.getGender());
        a.setSize(req.getSize());
        a.setStatus(req.getStatus() != null ? req.getStatus() : Animal.Status.AVAILABLE);
        a.setDescription(req.getDescription());
        a.setObservations(req.getObservations());
        a.setWeight(req.getWeight());
        a.setColor(req.getColor());
        a.setEntryDate(req.getEntryDate());
        a.setAdoptionDate(req.getAdoptionDate());
        a.setCastrated(req.getCastrated());
        a.setMicrochipped(req.getMicrochipped());
        a.setMicrochipNumber(req.getMicrochipNumber());
        a.setTemperament(req.getTemperament());
        a.setSpecialNeeds(req.getSpecialNeeds());
        a.setPhotoUrl(req.getPhotoUrl());
    }

    private AnimalDTO.Response toResponse(Animal a) {
        AnimalDTO.Response r = new AnimalDTO.Response();
        r.setId(a.getId());
        r.setName(a.getName());
        r.setSpecies(a.getSpecies());
        r.setBreed(a.getBreed());
        r.setAgeYears(a.getAgeYears());
        r.setAgeMonths(a.getAgeMonths());
        r.setGender(a.getGender());
        r.setSize(a.getSize());
        r.setStatus(a.getStatus());
        r.setDescription(a.getDescription());
        r.setObservations(a.getObservations());
        r.setWeight(a.getWeight());
        r.setColor(a.getColor());
        r.setEntryDate(a.getEntryDate());
        r.setAdoptionDate(a.getAdoptionDate());
        r.setCastrated(a.getCastrated());
        r.setMicrochipped(a.getMicrochipped());
        r.setMicrochipNumber(a.getMicrochipNumber());
        r.setTemperament(a.getTemperament());
        r.setSpecialNeeds(a.getSpecialNeeds());
        r.setPhotoUrl(a.getPhotoUrl());

        List<VaccineDTO.Response> vaccines = a.getVaccines() != null
                ? a.getVaccines().stream().map(this::toVaccineResponse).collect(Collectors.toList())
                : new ArrayList<>();
        r.setVaccines(vaccines);

        List<DiseaseDTO.Response> diseases = a.getDiseases() != null
                ? a.getDiseases().stream().map(this::toDiseaseResponse).collect(Collectors.toList())
                : new ArrayList<>();
        r.setDiseases(diseases);

        return r;
    }

    private AnimalDTO.Summary toSummary(Animal a) {
        AnimalDTO.Summary s = new AnimalDTO.Summary();
        s.setId(a.getId());
        s.setName(a.getName());
        s.setSpecies(a.getSpecies());
        s.setBreed(a.getBreed());
        s.setAgeYears(a.getAgeYears());
        s.setAgeMonths(a.getAgeMonths());
        s.setGender(a.getGender());
        s.setSize(a.getSize());
        s.setStatus(a.getStatus());
        s.setColor(a.getColor());
        s.setPhotoUrl(a.getPhotoUrl());
        s.setVaccineCount(a.getVaccines() != null ? a.getVaccines().size() : 0);
        s.setDiseaseCount(a.getDiseases() != null ? a.getDiseases().size() : 0);
        return s;
    }

    private Vaccine toVaccineEntity(VaccineDTO.Request req, Animal animal) {
        Vaccine v = new Vaccine();
        v.setName(req.getName());
        v.setApplicationDate(req.getApplicationDate());
        v.setNextDoseDate(req.getNextDoseDate());
        v.setVeterinarian(req.getVeterinarian());
        v.setLot(req.getLot());
        v.setManufacturer(req.getManufacturer());
        v.setNotes(req.getNotes());
        v.setAnimal(animal);
        return v;
    }

    private VaccineDTO.Response toVaccineResponse(Vaccine v) {
        VaccineDTO.Response r = new VaccineDTO.Response();
        r.setId(v.getId());
        r.setName(v.getName());
        r.setApplicationDate(v.getApplicationDate());
        r.setNextDoseDate(v.getNextDoseDate());
        r.setVeterinarian(v.getVeterinarian());
        r.setLot(v.getLot());
        r.setManufacturer(v.getManufacturer());
        r.setNotes(v.getNotes());
        r.setAnimalId(v.getAnimal().getId());
        return r;
    }

    private Disease toDiseaseEntity(DiseaseDTO.Request req, Animal animal) {
        Disease d = new Disease();
        d.setName(req.getName());
        d.setDescription(req.getDescription());
        d.setDiagnosisDate(req.getDiagnosisDate());
        d.setRecoveryDate(req.getRecoveryDate());
        d.setStatus(req.getStatus());
        d.setTreatment(req.getTreatment());
        d.setVeterinarian(req.getVeterinarian());
        d.setNotes(req.getNotes());
        d.setAnimal(animal);
        return d;
    }

    private DiseaseDTO.Response toDiseaseResponse(Disease d) {
        DiseaseDTO.Response r = new DiseaseDTO.Response();
        r.setId(d.getId());
        r.setName(d.getName());
        r.setDescription(d.getDescription());
        r.setDiagnosisDate(d.getDiagnosisDate());
        r.setRecoveryDate(d.getRecoveryDate());
        r.setStatus(d.getStatus());
        r.setTreatment(d.getTreatment());
        r.setVeterinarian(d.getVeterinarian());
        r.setNotes(d.getNotes());
        r.setAnimalId(d.getAnimal().getId());
        return r;
    }
}
