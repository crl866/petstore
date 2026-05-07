package com.petstore.service;

import com.petstore.dto.PetDTO;
import com.petstore.entity.Pet;
import com.petstore.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetService {

    private final PetRepository petRepository;

    @Cacheable(value = "pets", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<PetDTO> getAllAvailablePets(Pageable pageable) {
        log.debug("Fetching all available pets with pagination: {}", pageable);
        Page<Pet> pets = petRepository.findByAvailabilityStatus("Available", pageable);
        return pets.map(this::convertToDTO);
    }

    public Page<PetDTO> getPetsByCategory(Long categoryId, Pageable pageable) {
        log.debug("Fetching pets by category: {}", categoryId);
        Page<Pet> pets = petRepository.findByCategoryIdAndAvailabilityStatus(categoryId, "Available", pageable);
        return pets.map(this::convertToDTO);
    }

    public Page<PetDTO> searchPets(String searchTerm, Pageable pageable) {
        log.debug("Searching pets with term: {}", searchTerm);
        Page<Pet> pets = petRepository.search(searchTerm, pageable);
        return pets.map(this::convertToDTO);
    }

    public Page<PetDTO> searchPetsByCategory(Long categoryId, String searchTerm, Pageable pageable) {
        log.debug("Searching pets in category {} with term: {}", categoryId, searchTerm);
        Page<Pet> pets = petRepository.searchByCategory(categoryId, searchTerm, pageable);
        return pets.map(this::convertToDTO);
    }

    @Cacheable(value = "pet", key = "#petId")
    public PetDTO getPetById(Long petId) {
        log.debug("Fetching pet by ID: {}", petId);
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + petId));
        return convertToDTO(pet);
    }

    @CacheEvict(value = { "pets", "pet" }, allEntries = true)
    public PetDTO createPet(Pet pet) {
        log.info("Creating new pet: {}", pet.getName());
        Pet savedPet = petRepository.save(pet);
        return convertToDTO(savedPet);
    }

    @CacheEvict(value = { "pets", "pet" }, key = "#petId")
    public PetDTO updatePet(Long petId, Pet petUpdates) {
        log.info("Updating pet with ID: {}", petId);
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + petId));

        if (petUpdates.getName() != null)
            pet.setName(petUpdates.getName());
        if (petUpdates.getSpecies() != null)
            pet.setSpecies(petUpdates.getSpecies());
        if (petUpdates.getBreed() != null)
            pet.setBreed(petUpdates.getBreed());
        if (petUpdates.getAge() != null)
            pet.setAge(petUpdates.getAge());
        if (petUpdates.getBio() != null)
            pet.setBio(petUpdates.getBio());
        if (petUpdates.getAvailabilityStatus() != null)
            pet.setAvailabilityStatus(petUpdates.getAvailabilityStatus());

        Pet updatedPet = petRepository.save(pet);
        return convertToDTO(updatedPet);
    }

    @CacheEvict(value = { "pets", "pet" }, allEntries = true)
    public void deletePet(Long petId) {
        log.info("Deleting pet with ID: {}", petId);
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + petId));

        // Soft delete
        pet.setAvailabilityStatus("Deleted");
        petRepository.save(pet);
    }

    private PetDTO convertToDTO(Pet pet) {
        List<String> photoUrls = pet.getPhotos() != null ? pet.getPhotos().stream()
                .map(photo -> photo.getPhotoUrl())
                .collect(Collectors.toList()) : List.of();

        String healthStatus = null;
        String healthStatusNotes = null;
        if (pet.getHealthStatus() != null) {
            healthStatus = pet.getHealthStatus().getStatus().getDisplayName();
            healthStatusNotes = pet.getHealthStatus().getNotes();
        }

        return PetDTO.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .breed(pet.getBreed())
                .age(pet.getAge())
                .bio(pet.getBio())
                .categoryId(pet.getCategory().getId())
                .categoryName(pet.getCategory().getName())
                .availabilityStatus(pet.getAvailabilityStatus())
                .photoUrls(photoUrls)
                .healthStatus(healthStatus)
                .healthStatusNotes(healthStatusNotes)
                .createdAt(pet.getCreatedAt())
                .updatedAt(pet.getUpdatedAt())
                .build();
    }
}
