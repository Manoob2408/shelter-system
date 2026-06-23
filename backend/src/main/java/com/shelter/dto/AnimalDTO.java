package com.shelter.dto;

import com.shelter.model.Animal;
import com.shelter.model.Disease;
import com.shelter.model.Vaccine;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

public class AnimalDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String name;
        private Animal.Species species;
        private String breed;
        private Integer ageYears;
        private Integer ageMonths;
        private Animal.Gender gender;
        private Animal.Size size;
        private Animal.Status status;
        private String description;
        private String observations;
        private Double weight;
        private String color;
        private LocalDate entryDate;
        private LocalDate adoptionDate;
        private Boolean castrated;
        private Boolean microchipped;
        private String microchipNumber;
        private String temperament;
        private String specialNeeds;
        private String photoUrl;
        private List<VaccineDTO.Request> vaccines;
        private List<DiseaseDTO.Request> diseases;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private Animal.Species species;
        private String breed;
        private Integer ageYears;
        private Integer ageMonths;
        private Animal.Gender gender;
        private Animal.Size size;
        private Animal.Status status;
        private String description;
        private String observations;
        private Double weight;
        private String color;
        private LocalDate entryDate;
        private LocalDate adoptionDate;
        private Boolean castrated;
        private Boolean microchipped;
        private String microchipNumber;
        private String temperament;
        private String specialNeeds;
        private String photoUrl;
        private List<VaccineDTO.Response> vaccines;
        private List<DiseaseDTO.Response> diseases;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Summary {
        private Long id;
        private String name;
        private Animal.Species species;
        private String breed;
        private Integer ageYears;
        private Integer ageMonths;
        private Animal.Gender gender;
        private Animal.Size size;
        private Animal.Status status;
        private String color;
        private String photoUrl;
        private int vaccineCount;
        private int diseaseCount;
    }
}
