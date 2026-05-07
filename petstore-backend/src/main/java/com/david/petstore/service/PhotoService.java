package com.david.petstore.service;

import com.david.petstore.dto.PetPhotoDTO;
import com.david.petstore.repository.PetPhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PhotoService {
    private final PetPhotoRepository petPhotoRepository;

    public List<PetPhotoDTO> getPhotosByPetId(Long petId) {
        return petPhotoRepository.findByPetIdOrderByDisplayOrder(petId).stream()
            .map(photo -> PetPhotoDTO.builder()
                .id(photo.getId())
                .photoUrl(photo.getPhotoUrl())
                .displayOrder(photo.getDisplayOrder())
                .build())
            .collect(Collectors.toList());
    }
}
