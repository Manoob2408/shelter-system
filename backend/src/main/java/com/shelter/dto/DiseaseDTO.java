package com.shelter.dto;

import com.shelter.model.Disease;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public class DiseaseDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String name;
        private String description;
        private LocalDate diagnosisDate;
        private LocalDate recoveryDate;
        private Disease.DiseaseStatus status;
        private String treatment;
        private String veterinarian;
        private String notes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private LocalDate diagnosisDate;
        private LocalDate recoveryDate;
        private Disease.DiseaseStatus status;
        private String treatment;
        private String veterinarian;
        private String notes;
        private Long animalId;
    }
}
