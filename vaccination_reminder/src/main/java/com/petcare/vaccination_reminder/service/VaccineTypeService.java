package com.petcare.vaccination_reminder.service;

import com.petcare.vaccination_reminder.entity.VaccineType;
import com.petcare.vaccination_reminder.repository.VaccineTypeRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VaccineTypeService {

    private final VaccineTypeRepository repository;

    public VaccineTypeService(VaccineTypeRepository repository) {
        this.repository = repository;
    }

    public VaccineType createVaccineType(VaccineType vaccineType) {
        return repository.save(vaccineType);
    }

    public List<VaccineType> getAllVaccineTypes() {
        return repository.findAll();
    }

    public VaccineType getVaccineTypeById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vaccine type not found")
                );
    }

    public VaccineType updateVaccineType(
            Long id,
            VaccineType vaccineType) {

        VaccineType existing = getVaccineTypeById(id);

        existing.setName(vaccineType.getName());
        existing.setDescription(vaccineType.getDescription());

        return repository.save(existing);
    }

    public void deleteVaccineType(Long id) {
        repository.deleteById(id);
    }
}