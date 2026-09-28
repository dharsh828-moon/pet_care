package com.petcare.vaccination_reminder.service;

import com.petcare.vaccination_reminder.entity.Owner;
import com.petcare.vaccination_reminder.entity.Pet;
import com.petcare.vaccination_reminder.repository.ownerRepository;
import com.petcare.vaccination_reminder.repository.petRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class petservice {

    private final petRepository petRepository;
    private final ownerRepository ownerRepository;

    public petservice(petRepository petRepository,
                      ownerRepository ownerRepository) {
        this.petRepository = petRepository;
        this.ownerRepository = ownerRepository;
    }

    public Pet createPet(Pet pet) {

        if (pet.getOwner() != null && pet.getOwner().getId() != null) {

            Owner owner = ownerRepository.findById(
                    pet.getOwner().getId()
            ).orElseThrow(() ->
                    new RuntimeException("Owner not found")
            );

            pet.setOwner(owner);
        }

        return petRepository.save(pet);
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Pet not found")
                );
    }

    public Pet updatePet(Long id, Pet pet) {

        Pet existingPet = getPetById(id);

        existingPet.setName(pet.getName());
        existingPet.setSpecies(pet.getSpecies());
        existingPet.setBreed(pet.getBreed());
        existingPet.setDateOfBirth(pet.getDateOfBirth());

        if (pet.getOwner() != null &&
            pet.getOwner().getId() != null) {

            Owner owner = ownerRepository.findById(
                    pet.getOwner().getId()
            ).orElseThrow(() ->
                    new RuntimeException("Owner not found")
            );

            existingPet.setOwner(owner);
        }

        return petRepository.save(existingPet);
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }
}