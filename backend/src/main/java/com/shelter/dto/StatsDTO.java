package com.shelter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
    private Long totalAnimals;
    private Long available;
    private Long adopted;
    private Long underTreatment;
    private Long reserved;
    private Long dogs;
    private Long cats;
    private Long others;
}
