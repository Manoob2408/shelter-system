package com.shelter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "animals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Species species;

    @NotBlank
    @Column(nullable = false)
    private String breed;

    private Integer ageYears;
    private Integer ageMonths;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private Size size;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String observations;

    private Double weight;
    private String color;
    private LocalDate entryDate;
    private LocalDate adoptionDate;

    private Boolean castrated;
    private Boolean microchipped;
    private String microchipNumber;

    @Column(columnDefinition = "TEXT")
    private String temperament;

    @Column(columnDefinition = "TEXT")
    private String specialNeeds;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Vaccine> vaccines;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Disease> diseases;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    public enum Species {
        DOG, CAT, RABBIT, BIRD, REPTILE, OTHER
    }

    public enum Gender {
        MALE, FEMALE
    }

    public enum Size {
        SMALL, MEDIUM, LARGE, EXTRA_LARGE
    }

    public enum Status {
        AVAILABLE, ADOPTED, UNDER_TREATMENT, RESERVED, DECEASED
    }
}
