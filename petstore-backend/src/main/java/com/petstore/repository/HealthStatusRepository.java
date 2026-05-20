package com.petstore.repository;

import com.petstore.entity.HealthStatus;
import com.petstore.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthStatusRepository extends JpaRepository<HealthStatus, Long> {
    List<HealthStatus> findByPetOrderByUpdatedAtDesc(Pet pet);

    @Query("SELECT hs FROM HealthStatus hs WHERE hs.pet.id = :petId ORDER BY hs.updatedAt DESC")
    List<HealthStatus> findByPetId(@Param("petId") Long petId);
}
