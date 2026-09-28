package com.petcare.vaccination_reminder.repository;

import com.petcare.vaccination_reminder.entity.VaccineType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccineTypeRepository
        extends JpaRepository<VaccineType, Long> {
}