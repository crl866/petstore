package com.david.petstore.controller;

import com.david.petstore.dto.ApiResponse;
import com.david.petstore.dto.PetDTO;
import com.david.petstore.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pets")
@RequiredArgsConstructor
public class PetController {
    private final PetService petService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PetDTO>>> getAllPets(
            @RequestParam(value = "categoryId", required = false) Long categoryId) {
        List<PetDTO> pets;
        if (categoryId != null) {
            pets = petService.getPetsByCategoryId(categoryId);
        } else {
            pets = petService.getAllPets();
        }
        return ResponseEntity.ok(ApiResponse.ok("Pets retrieved successfully", pets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetDTO>> getPetById(@PathVariable Long id) {
        PetDTO pet = petService.getPetById(id);
        return ResponseEntity.ok(ApiResponse.ok("Pet retrieved successfully", pet));
    }
}
