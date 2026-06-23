package com.shelter.controller;

import com.shelter.dto.AnimalDTO;
import com.shelter.dto.StatsDTO;
import com.shelter.model.Animal;
import com.shelter.service.AnimalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnimalController {

    private final AnimalService animalService;

    @GetMapping
    public ResponseEntity<List<AnimalDTO.Summary>> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Animal.Species species,
            @RequestParam(required = false) Animal.Status status,
            @RequestParam(required = false) String breed) {
        return ResponseEntity.ok(animalService.findAll(name, species, status, breed));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalDTO.Response> findById(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.findById(id));
    }

    @PostMapping
    public ResponseEntity<AnimalDTO.Response> create(@RequestBody AnimalDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(animalService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalDTO.Response> update(@PathVariable Long id, @RequestBody AnimalDTO.Request request) {
        return ResponseEntity.ok(animalService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        animalService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsDTO> getStats() {
        return ResponseEntity.ok(animalService.getStats());
    }
}
