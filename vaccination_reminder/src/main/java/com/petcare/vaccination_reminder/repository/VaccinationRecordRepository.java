package com.petcare.vaccination_reminder.repository;

import com.petcare.vaccination_reminder.entity.VaccinationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccinationRecordRepository extends JpaRepository<VaccinationRecord, Long> {
}