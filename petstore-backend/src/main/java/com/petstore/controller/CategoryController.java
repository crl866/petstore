package com.petstore.controller;

import com.petstore.dto.ApiResponse;
import com.petstore.dto.CategoryDTO;
import com.petstore.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getCategories() {
        log.debug("GET /api/v1/categories - Fetching all categories");

        List<CategoryDTO> categories = categoryService.getAllCategories();

        ApiResponse<List<CategoryDTO>> response = ApiResponse.<List<CategoryDTO>>builder()
                .data(categories)
                .build();

        return ResponseEntity.ok(response);
    }
}
