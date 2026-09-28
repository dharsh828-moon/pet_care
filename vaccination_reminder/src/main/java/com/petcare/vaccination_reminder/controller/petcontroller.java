package com.petcare.vaccination_reminder.controller;

import com.petcare.vaccination_reminder.entity.Pet;
import com.petcare.vaccination_reminder.service.petservice;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class petcontroller {

    private final petservice petService;

    public petcontroller(petservice petService) {
        this.petService = petService;
    }

    @PostMapping
    public Pet createPet(@RequestBody Pet pet) {
        return petService.createPet(pet);
    }

    @GetMapping
    public List<Pet> getAllPets() {
        return petService.getAllPets();
    }

    @GetMapping("/{id}")
    public Pet getPet(@PathVariable Long id) {
        return petService.getPetById(id);
    }

    @PutMapping("/{id}")
    public Pet updatePet(
            @PathVariable Long id,
            @RequestBody Pet pet) {

        return petService.updatePet(id, pet);
    }

    @DeleteMapping("/{id}")
    public String deletePet(@PathVariable Long id) {

        petService.deletePet(id);

        return "Pet deleted successfully";
    }
}