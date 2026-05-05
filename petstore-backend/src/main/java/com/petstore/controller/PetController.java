package com.petstore.controller;

import com.petstore.dto.ApiResponse;
import com.petstore.dto.PetDTO;
import com.petstore.service.PetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pets")
@RequiredArgsConstructor
@Slf4j
public class PetController {

    private final PetService petService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PetDTO>>> getPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {

        log.debug("GET /api/v1/pets - page: {}, size: {}, categoryId: {}, search: {}", page, size, categoryId, search);

        Pageable pageable = PageRequest.of(page, size);
        Page<PetDTO> result;

        if (search != null && !search.isEmpty()) {
            if (categoryId != null) {
                result = petService.searchPetsByCategory(categoryId, search, pageable);
            } else {
                result = petService.searchPets(search, pageable);
            }
        } else if (categoryId != null) {
            result = petService.getPetsByCategory(categoryId, pageable);
        } else {
            result = petService.getAllAvailablePets(pageable);
        }

        ApiResponse<Page<PetDTO>> response = ApiResponse.<Page<PetDTO>>builder()
                .data(result)
                .totalCount(result.getTotalElements())
                .page(page)
                .pageSize(size)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetDTO>> getPetById(@PathVariable Long id) {
        log.debug("GET /api/v1/pets/{} - Fetching pet details", id);

        PetDTO pet = petService.getPetById(id);

        ApiResponse<PetDTO> response = ApiResponse.<PetDTO>builder()
                .data(pet)
                .build();

        return ResponseEntity.ok(response);
    }
}
