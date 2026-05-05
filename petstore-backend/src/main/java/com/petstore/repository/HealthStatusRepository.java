package com.petstore.repository;

import com.petstore.entity.HealthStatus;
import com.petstore.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthStatusRepository extends JpaRepository<HealthStatus, Long> {
    Optional<HealthStatus> findByPet(Pet pet);

    Optional<HealthStatus> findByPetId(Long petId);
}
