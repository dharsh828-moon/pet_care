package com.petcare.vaccination_reminder.controller;

import com.petcare.vaccination_reminder.entity.VaccinationRecord;
import com.petcare.vaccination_reminder.service.VaccinationRecordService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vaccinations")
public class VaccinationRecordController {

    private final VaccinationRecordService vaccinationRecordService;

    public VaccinationRecordController(
            VaccinationRecordService vaccinationRecordService) {

        this.vaccinationRecordService = vaccinationRecordService;
    }

    @PostMapping
    public VaccinationRecord createVaccination(
            @RequestBody VaccinationRecord vaccinationRecord) {

        return vaccinationRecordService.createVaccination(
                vaccinationRecord
        );
    }

    @GetMapping
    public List<VaccinationRecord> getAllVaccinations() {
        return vaccinationRecordService.getAllVaccinations();
    }

    @GetMapping("/{id}")
    public VaccinationRecord getVaccinationById(
            @PathVariable Long id) {

        return vaccinationRecordService.getVaccinationById(id);
    }

    @PutMapping("/{id}")
    public VaccinationRecord updateVaccination(
            @PathVariable Long id,
            @RequestBody VaccinationRecord vaccinationRecord) {

        return vaccinationRecordService.updateVaccination(
                id,
                vaccinationRecord
        );
    }

    @DeleteMapping("/{id}")
    public String deleteVaccination(
            @PathVariable Long id) {

        vaccinationRecordService.deleteVaccination(id);

        return "Vaccination deleted successfully";
    }
}