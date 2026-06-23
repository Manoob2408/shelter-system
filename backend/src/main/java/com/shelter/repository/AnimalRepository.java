package com.shelter.repository;

import com.shelter.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    List<Animal> findBySpecies(Animal.Species species);

    List<Animal> findByStatus(Animal.Status status);

    List<Animal> findBySpeciesAndStatus(Animal.Species species, Animal.Status status);

    @Query("SELECT a FROM Animal a WHERE " +
           "(:name IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:species IS NULL OR a.species = :species) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:breed IS NULL OR LOWER(a.breed) LIKE LOWER(CONCAT('%', :breed, '%')))")
    List<Animal> findByFilters(
        @Param("name") String name,
        @Param("species") Animal.Species species,
        @Param("status") Animal.Status status,
        @Param("breed") String breed
    );

    @Query("SELECT COUNT(a) FROM Animal a WHERE a.status = :status")
    Long countByStatus(@Param("status") Animal.Status status);

    @Query("SELECT COUNT(a) FROM Animal a WHERE a.species = :species")
    Long countBySpecies(@Param("species") Animal.Species species);
}
