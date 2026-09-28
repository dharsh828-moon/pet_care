package com.petcare.vaccination_reminder.service;

import com.petcare.vaccination_reminder.entity.Pet;
import com.petcare.vaccination_reminder.entity.VaccinationRecord;
import com.petcare.vaccination_reminder.entity.VaccineType;

import com.petcare.vaccination_reminder.repository.VaccinationRecordRepository;
import com.petcare.vaccination_reminder.repository.petRepository;
import com.petcare.vaccination_reminder.repository.VaccineTypeRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VaccinationRecordService {

    private final VaccinationRecordRepository vaccinationRecordRepository;
    private final petRepository petRepository;
    private final VaccineTypeRepository vaccineTypeRepository;

    public VaccinationRecordService(
            VaccinationRecordRepository vaccinationRecordRepository,
            petRepository petRepository,
            VaccineTypeRepository vaccineTypeRepository) {

        this.vaccinationRecordRepository = vaccinationRecordRepository;
        this.petRepository = petRepository;
        this.vaccineTypeRepository = vaccineTypeRepository;
    }

    public VaccinationRecord createVaccination(
            VaccinationRecord vaccinationRecord) {

        if (vaccinationRecord.getPet() == null ||
            vaccinationRecord.getPet().getId() == null) {

            throw new RuntimeException("Pet ID is required");
        }

        if (vaccinationRecord.getVaccineType() == null ||
            vaccinationRecord.getVaccineType().getId() == null) {

            throw new RuntimeException("Vaccine Type ID is required");
        }

        Pet pet = petRepository.findById(
                vaccinationRecord.getPet().getId()
        ).orElseThrow(() ->
                new RuntimeException("Pet not found")
        );

        VaccineType vaccineType = vaccineTypeRepository.findById(
                vaccinationRecord.getVaccineType().getId()
        ).orElseThrow(() ->
                new RuntimeException("Vaccine Type not found")
        );

        vaccinationRecord.setPet(pet);
        vaccinationRecord.setVaccineType(vaccineType);

        return vaccinationRecordRepository.save(vaccinationRecord);
    }

    public List<VaccinationRecord> getAllVaccinations() {
        return vaccinationRecordRepository.findAll();
    }

    public VaccinationRecord getVaccinationById(Long id) {
        return vaccinationRecordRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vaccination not found")
                );
    }

    public VaccinationRecord updateVaccination(
            Long id,
            VaccinationRecord vaccinationRecord) {

        VaccinationRecord existing =
                getVaccinationById(id);

        existing.setVaccinationDate(
                vaccinationRecord.getVaccinationDate()
        );

        existing.setNextDueDate(
                vaccinationRecord.getNextDueDate()
        );

        if (vaccinationRecord.getPet() != null &&
            vaccinationRecord.getPet().getId() != null) {

            Pet pet = petRepository.findById(
                    vaccinationRecord.getPet().getId()
            ).orElseThrow(() ->
                    new RuntimeException("Pet not found")
            );

            existing.setPet(pet);
        }

        if (vaccinationRecord.getVaccineType() != null &&
            vaccinationRecord.getVaccineType().getId() != null) {

            VaccineType vaccineType =
                    vaccineTypeRepository.findById(
                            vaccinationRecord
                                    .getVaccineType()
                                    .getId()
                    ).orElseThrow(() ->
                            new RuntimeException("Vaccine Type not found")
                    );

            existing.setVaccineType(vaccineType);
        }

        return vaccinationRecordRepository.save(existing);
    }

    public void deleteVaccination(Long id) {
        vaccinationRecordRepository.deleteById(id);
    }
}