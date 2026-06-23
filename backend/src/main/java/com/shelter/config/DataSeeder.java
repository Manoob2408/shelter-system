package com.shelter.config;

import com.shelter.model.Animal;
import com.shelter.model.Disease;
import com.shelter.model.Vaccine;
import com.shelter.repository.AnimalRepository;
import com.shelter.repository.DiseaseRepository;
import com.shelter.repository.VaccineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AnimalRepository animalRepository;
    private final VaccineRepository vaccineRepository;
    private final DiseaseRepository diseaseRepository;

    @Override
    public void run(String... args) throws Exception {
        if (animalRepository.count() > 0) return;

        // Dog 1
        Animal rex = new Animal();
        rex.setName("Rex");
        rex.setSpecies(Animal.Species.DOG);
        rex.setBreed("Labrador Retriever");
        rex.setAgeYears(3);
        rex.setAgeMonths(0);
        rex.setGender(Animal.Gender.MALE);
        rex.setSize(Animal.Size.LARGE);
        rex.setStatus(Animal.Status.AVAILABLE);
        rex.setColor("Amarelo");
        rex.setWeight(28.5);
        rex.setCastrated(true);
        rex.setMicrochipped(true);
        rex.setMicrochipNumber("985141001234567");
        rex.setTemperament("Dócil, brincalhão e amoroso com crianças");
        rex.setDescription("Rex é um labrador adorável que chegou ao abrigo após ser encontrado abandonado. Adora brincar e é muito sociável.");
        rex.setEntryDate(LocalDate.now().minusMonths(2));
        animalRepository.save(rex);

        Vaccine v1 = new Vaccine();
        v1.setName("V10 (Décupla)");
        v1.setApplicationDate(LocalDate.now().minusMonths(1));
        v1.setNextDoseDate(LocalDate.now().plusMonths(11));
        v1.setVeterinarian("Dra. Ana Souza");
        v1.setManufacturer("Zoetis");
        v1.setAnimal(rex);
        vaccineRepository.save(v1);

        Vaccine v2 = new Vaccine();
        v2.setName("Antirrábica");
        v2.setApplicationDate(LocalDate.now().minusMonths(1));
        v2.setNextDoseDate(LocalDate.now().plusYears(1));
        v2.setVeterinarian("Dra. Ana Souza");
        v2.setAnimal(rex);
        vaccineRepository.save(v2);

        // Dog 2
        Animal luna = new Animal();
        luna.setName("Luna");
        luna.setSpecies(Animal.Species.DOG);
        luna.setBreed("Poodle");
        luna.setAgeYears(1);
        luna.setAgeMonths(6);
        luna.setGender(Animal.Gender.FEMALE);
        luna.setSize(Animal.Size.SMALL);
        luna.setStatus(Animal.Status.AVAILABLE);
        luna.setColor("Branco");
        luna.setWeight(5.2);
        luna.setCastrated(false);
        luna.setMicrochipped(false);
        luna.setTemperament("Animada e carinhosa");
        luna.setDescription("Luna é uma poodle encantadora que precisa de um lar cheio de amor.");
        luna.setEntryDate(LocalDate.now().minusWeeks(3));
        animalRepository.save(luna);

        // Cat 1
        Animal mimi = new Animal();
        mimi.setName("Mimi");
        mimi.setSpecies(Animal.Species.CAT);
        mimi.setBreed("Siamês");
        mimi.setAgeYears(4);
        mimi.setAgeMonths(0);
        mimi.setGender(Animal.Gender.FEMALE);
        mimi.setSize(Animal.Size.SMALL);
        mimi.setStatus(Animal.Status.UNDER_TREATMENT);
        mimi.setColor("Bege e marrom");
        mimi.setWeight(3.8);
        mimi.setCastrated(true);
        mimi.setMicrochipped(false);
        mimi.setTemperament("Independente, calma e seletiva");
        mimi.setDescription("Mimi está em tratamento para infecção respiratória mas está se recuperando muito bem.");
        mimi.setEntryDate(LocalDate.now().minusMonths(1));
        mimi.setSpecialNeeds("Medicação diária por mais 2 semanas");
        animalRepository.save(mimi);

        Disease d1 = new Disease();
        d1.setName("Infecção Respiratória Superior");
        d1.setDescription("Infecção das vias respiratórias superiores causada por herpesvírus felino");
        d1.setDiagnosisDate(LocalDate.now().minusWeeks(2));
        d1.setStatus(Disease.DiseaseStatus.ACTIVE);
        d1.setTreatment("Antibiótico amoxicilina 50mg 2x ao dia + suporte nutricional");
        d1.setVeterinarian("Dr. Carlos Lima");
        d1.setAnimal(mimi);
        diseaseRepository.save(d1);

        // Cat 2
        Animal tom = new Animal();
        tom.setName("Tom");
        tom.setSpecies(Animal.Species.CAT);
        tom.setBreed("Persa");
        tom.setAgeYears(2);
        tom.setAgeMonths(3);
        tom.setGender(Animal.Gender.MALE);
        tom.setSize(Animal.Size.MEDIUM);
        tom.setStatus(Animal.Status.ADOPTED);
        tom.setColor("Laranja e branco");
        tom.setWeight(4.5);
        tom.setCastrated(true);
        tom.setMicrochipped(true);
        tom.setMicrochipNumber("985141009876543");
        tom.setTemperament("Tranquilo e carinhoso");
        tom.setDescription("Tom foi adotado por uma família amorosa.");
        tom.setEntryDate(LocalDate.now().minusMonths(4));
        tom.setAdoptionDate(LocalDate.now().minusWeeks(1));
        animalRepository.save(tom);

        // Rabbit
        Animal bolinha = new Animal();
        bolinha.setName("Bolinha");
        bolinha.setSpecies(Animal.Species.RABBIT);
        bolinha.setBreed("Angorá");
        bolinha.setAgeYears(0);
        bolinha.setAgeMonths(8);
        bolinha.setGender(Animal.Gender.FEMALE);
        bolinha.setSize(Animal.Size.SMALL);
        bolinha.setStatus(Animal.Status.AVAILABLE);
        bolinha.setColor("Branco");
        bolinha.setWeight(1.2);
        bolinha.setCastrated(false);
        bolinha.setMicrochipped(false);
        bolinha.setTemperament("Curiosa e ativa");
        bolinha.setDescription("Bolinha é uma coelhinha adorável que chegou ao abrigo muito assustada mas já está se adaptando bem.");
        bolinha.setEntryDate(LocalDate.now().minusWeeks(1));
        animalRepository.save(bolinha);
    }
}
