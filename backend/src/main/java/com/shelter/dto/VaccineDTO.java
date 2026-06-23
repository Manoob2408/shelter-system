package com.shelter.dto;

import com.shelter.model.Disease;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public class VaccineDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String name;
        private LocalDate applicationDate;
        private LocalDate nextDoseDate;
        private String veterinarian;
        private String lot;
        private String manufacturer;
        private String notes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private LocalDate applicationDate;
        private LocalDate nextDoseDate;
        private String veterinarian;
        private String lot;
        private String manufacturer;
        private String notes;
        private Long animalId;
    }
}
