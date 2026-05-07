package com.david.petstore.repository;

import com.david.petstore.entity.HealthStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthStatusRepository extends JpaRepository<HealthStatus, Long> {
    @Query("SELECT hs FROM HealthStatus hs WHERE hs.pet.id = :petId")
    List<HealthStatus> findByPetId(@Param("petId") Long petId);
}
