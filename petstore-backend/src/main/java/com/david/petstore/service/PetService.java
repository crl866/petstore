package com.david.petstore.service;

import com.david.petstore.dto.CategoryDTO;
import com.david.petstore.dto.HealthStatusDTO;
import com.david.petstore.dto.PetDTO;
import com.david.petstore.dto.PetPhotoDTO;
import com.david.petstore.entity.Pet;
import com.david.petstore.exception.ResourceNotFoundException;
import com.david.petstore.repository.HealthStatusRepository;
import com.david.petstore.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PetService {
    private final PetRepository petRepository;
    private final HealthStatusRepository healthStatusRepository;

    public List<PetDTO> getAllPets() {
        return petRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<PetDTO> getPetsByCategoryId(Long categoryId) {
        return petRepository.findByCategoryId(categoryId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public PetDTO getPetById(Long petId) {
        Pet pet = petRepository.findById(petId)
            .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));
        return convertToDTO(pet);
    }

    private PetDTO convertToDTO(Pet pet) {
        CategoryDTO categoryDTO = CategoryDTO.builder()
            .id(pet.getCategory().getId())
            .name(pet.getCategory().getName())
            .description(pet.getCategory().getDescription())
            .build();

        List<PetPhotoDTO> photoDTOs = pet.getPhotos().stream()
            .map(photo -> PetPhotoDTO.builder()
                .id(photo.getId())
                .photoUrl(photo.getPhotoUrl())
                .displayOrder(photo.getDisplayOrder())
                .build())
            .collect(Collectors.toList());

        List<HealthStatusDTO> healthStatusDTOs = pet.getHealthStatuses().stream()
            .map(status -> HealthStatusDTO.builder()
                .id(status.getId())
                .status(status.getStatus())
                .createdAt(status.getCreatedAt())
                .build())
            .collect(Collectors.toList());

        return PetDTO.builder()
            .id(pet.getId())
            .name(pet.getName())
            .description(pet.getDescription())
            .category(categoryDTO)
            .photos(photoDTOs)
            .healthStatuses(healthStatusDTOs)
            .createdAt(pet.getCreatedAt())
            .updatedAt(pet.getUpdatedAt())
            .build();
    }
}
