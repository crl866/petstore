package com.david.petstore.repository;

import com.david.petstore.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    @Query("SELECT DISTINCT p FROM Pet p LEFT JOIN FETCH p.photos LEFT JOIN FETCH p.healthStatuses WHERE p.category.id = :categoryId")
    List<Pet> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT DISTINCT p FROM Pet p LEFT JOIN FETCH p.photos LEFT JOIN FETCH p.healthStatuses")
    List<Pet> findAllWithDetails();
}
