package com.petstore.repository;

import com.petstore.entity.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    Page<Pet> findByAvailabilityStatus(String status, Pageable pageable);

    Page<Pet> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Pet> findByCategoryIdAndAvailabilityStatus(Long categoryId, String status, Pageable pageable);

    @Query("SELECT p FROM Pet p WHERE p.availabilityStatus = 'Available' AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.breed) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.bio) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Pet> search(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT p FROM Pet p WHERE p.availabilityStatus = 'Available' AND p.category.id = :categoryId AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.breed) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.bio) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Pet> searchByCategory(@Param("categoryId") Long categoryId, @Param("searchTerm") String searchTerm,
            Pageable pageable);

    Page<Pet> findByAvailabilityStatusOrderByCreatedAtDesc(String status, Pageable pageable);
}
