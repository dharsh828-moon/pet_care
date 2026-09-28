package com.petcare.vaccination_reminder.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "vaccination_records")
public class VaccinationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate vaccinationDate;

    private LocalDate nextDueDate;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "vaccine_type_id")
    private VaccineType vaccineType;

    public VaccinationRecord() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getVaccinationDate() {
        return vaccinationDate;
    }

    public void setVaccinationDate(LocalDate vaccinationDate) {
        this.vaccinationDate = vaccinationDate;
    }

    public LocalDate getNextDueDate() {
        return nextDueDate;
    }

    public void setNextDueDate(LocalDate nextDueDate) {
        this.nextDueDate = nextDueDate;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public VaccineType getVaccineType() {
        return vaccineType;
    }

    public void setVaccineType(VaccineType vaccineType) {
        this.vaccineType = vaccineType;
    }
}