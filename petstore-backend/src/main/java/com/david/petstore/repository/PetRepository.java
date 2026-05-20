package com.david.petstore.repository;

import com.david.petstore.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByCategoryId(Long categoryId);

    List<Pet> findAll();
}
