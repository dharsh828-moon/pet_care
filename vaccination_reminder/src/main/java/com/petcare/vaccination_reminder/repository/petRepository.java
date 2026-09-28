package com.petcare.vaccination_reminder.repository;

import com.petcare.vaccination_reminder.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface petRepository extends JpaRepository<Pet, Long> {
}