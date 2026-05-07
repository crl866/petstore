package com.petstore.controller;

import com.petstore.dto.ApiResponse;
import com.petstore.dto.PetDTO;
import com.petstore.entity.Pet;
import com.petstore.entity.HealthStatus;
import com.petstore.entity.HealthStatusEnum;
import com.petstore.service.PetService;
import com.petstore.repository.HealthStatusRepository;
import com.petstore.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/pets")
@RequiredArgsConstructor
@Slf4j
public class AdminPetController {

    private final PetService petService;
    private final PetRepository petRepository;
    private final HealthStatusRepository healthStatusRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PetDTO>>> getPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {

        log.debug("GET /api/v1/admin/pets - Admin pet listing");

        Pageable pageable = PageRequest.of(page, size);
        Page<Pet> pets;

        if (status != null && !status.isEmpty()) {
            pets = petRepository.findByAvailabilityStatus(status, pageable);
        } else {
            pets = petRepository.findAll(pageable);
        }

        Page<PetDTO> dtoPage = pets.map(pet -> convertToDTO(pet));

        ApiResponse<Page<PetDTO>> response = ApiResponse.<Page<PetDTO>>builder()
                .data(dtoPage)
                .totalCount(pets.getTotalElements())
                .page(page)
                .pageSize(size)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PetDTO>> createPet(@RequestBody Pet petRequest) {
        log.info("POST /api/v1/admin/pets - Creating new pet");

        Pet savedPet = petRepository.save(petRequest);
        PetDTO dto = convertToDTO(savedPet);

        ApiResponse<PetDTO> response = ApiResponse.<PetDTO>builder()
                .data(dto)
                .message("Pet created successfully")
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<PetDTO>> updatePet(
            @PathVariable Long id,
            @RequestBody Pet petUpdates) {

        log.info("PATCH /api/v1/admin/pets/{} - Updating pet", id);

        Pet existingPet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + id));

        if (petUpdates.getName() != null)
            existingPet.setName(petUpdates.getName());
        if (petUpdates.getSpecies() != null)
            existingPet.setSpecies(petUpdates.getSpecies());
        if (petUpdates.getBreed() != null)
            existingPet.setBreed(petUpdates.getBreed());
        if (petUpdates.getAge() != null)
            existingPet.setAge(petUpdates.getAge());
        if (petUpdates.getBio() != null)
            existingPet.setBio(petUpdates.getBio());
        if (petUpdates.getAvailabilityStatus() != null) {
            existingPet.setAvailabilityStatus(petUpdates.getAvailabilityStatus());
        }

        Pet updatedPet = petRepository.save(existingPet);
        PetDTO dto = convertToDTO(updatedPet);

        ApiResponse<PetDTO> response = ApiResponse.<PetDTO>builder()
                .data(dto)
                .message("Pet updated successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePet(@PathVariable Long id) {
        log.info("DELETE /api/v1/admin/pets/{} - Soft deleting pet", id);

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + id));

        // Soft delete
        pet.setAvailabilityStatus("Deleted");
        petRepository.save(pet);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Pet deleted successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/health-status")
    public ResponseEntity<ApiResponse<PetDTO>> updateHealthStatus(
            @PathVariable Long id,
            @RequestBody HealthStatus healthStatusUpdate) {

        log.info("PATCH /api/v1/admin/pets/{}/health-status - Updating health status", id);

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + id));

        HealthStatus healthStatus = healthStatusRepository.findByPetId(id)
                .orElse(new HealthStatus());

        healthStatus.setPet(pet);
        healthStatus.setStatus(healthStatusUpdate.getStatus());
        if (healthStatusUpdate.getNotes() != null) {
            healthStatus.setNotes(healthStatusUpdate.getNotes());
        }

        healthStatusRepository.save(healthStatus);
        pet.setHealthStatus(healthStatus);
        petRepository.save(pet);

        PetDTO dto = convertToDTO(pet);

        ApiResponse<PetDTO> response = ApiResponse.<PetDTO>builder()
                .data(dto)
                .message("Health status updated successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    private PetDTO convertToDTO(Pet pet) {
        java.util.List<String> photoUrls = pet.getPhotos() != null ? pet.getPhotos().stream()
                .map(photo -> photo.getPhotoUrl())
                .collect(java.util.stream.Collectors.toList()) : java.util.List.of();

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
