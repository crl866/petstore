package com.david.petstore.repository;

import com.david.petstore.entity.PetPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetPhotoRepository extends JpaRepository<PetPhoto, Long> {
    @Query("SELECT pp FROM PetPhoto pp WHERE pp.pet.id = :petId ORDER BY pp.displayOrder ASC")
    List<PetPhoto> findByPetIdOrderByDisplayOrder(@Param("petId") Long petId);
}
