package com.petcare.vaccination_reminder.controller;

import com.petcare.vaccination_reminder.entity.VaccineType;
import com.petcare.vaccination_reminder.service.VaccineTypeService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vaccine-types")
public class VaccineTypeController {

    private final VaccineTypeService vaccineTypeService;

    public VaccineTypeController(
            VaccineTypeService vaccineTypeService) {

        this.vaccineTypeService = vaccineTypeService;
    }

    @PostMapping
    public VaccineType createVaccineType(
            @RequestBody VaccineType vaccineType) {

        return vaccineTypeService.createVaccineType(vaccineType);
    }

    @GetMapping
    public List<VaccineType> getAllVaccineTypes() {
        return vaccineTypeService.getAllVaccineTypes();
    }

    @GetMapping("/{id}")
    public VaccineType getVaccineType(
            @PathVariable Long id) {

        return vaccineTypeService.getVaccineTypeById(id);
    }

    @PutMapping("/{id}")
    public VaccineType updateVaccineType(
            @PathVariable Long id,
            @RequestBody VaccineType vaccineType) {

        return vaccineTypeService.updateVaccineType(
                id,
                vaccineType
        );
    }

    @DeleteMapping("/{id}")
    public String deleteVaccineType(
            @PathVariable Long id) {

        vaccineTypeService.deleteVaccineType(id);

        return "Vaccine type deleted successfully";
    }
}