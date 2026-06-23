package com.shelter.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "diseases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate diagnosisDate;
    private LocalDate recoveryDate;

    @Enumerated(EnumType.STRING)
    private DiseaseStatus status;

    @Column(columnDefinition = "TEXT")
    private String treatment;

    private String veterinarian;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    public enum DiseaseStatus {
        ACTIVE, RECOVERED, CHRONIC, CONTROLLED
    }
}
