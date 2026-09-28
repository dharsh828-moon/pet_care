package com.petcare.vaccination_reminder.repository;

import com.petcare.vaccination_reminder.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ownerRepository extends JpaRepository<Owner, Long> {
}