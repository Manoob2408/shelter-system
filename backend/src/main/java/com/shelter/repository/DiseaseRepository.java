package com.shelter.repository;

import com.shelter.model.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiseaseRepository extends JpaRepository<Disease, Long> {
    List<Disease> findByAnimalId(Long animalId);
    void deleteByAnimalId(Long animalId);
}
