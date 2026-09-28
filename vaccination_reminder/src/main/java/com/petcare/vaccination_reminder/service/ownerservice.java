package com.petcare.vaccination_reminder.service;

import com.petcare.vaccination_reminder.entity.Owner;
import com.petcare.vaccination_reminder.repository.ownerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ownerservice {

    private final ownerRepository ownerRepository;

    public ownerservice(ownerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public Owner addOwner(Owner owner) {
        return ownerRepository.save(owner);
    }

    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    public Owner getOwner(Long id) {
        return ownerRepository.findById(id).orElse(null);
    }

    public void deleteOwner(Long id) {
        ownerRepository.deleteById(id);
    }
}
