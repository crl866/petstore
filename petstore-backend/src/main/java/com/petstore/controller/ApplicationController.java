package com.petstore.controller;

import com.petstore.dto.ApiResponse;
import com.petstore.dto.ApplicationDTO;
import com.petstore.entity.AdoptionApplication;
import com.petstore.entity.ApplicationStatusEnum;
import com.petstore.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Slf4j
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationDTO>> createApplication(
            @RequestBody AdoptionApplication application) {

        log.debug("POST /api/v1/applications - Creating new adoption application for: {}",
                application.getApplicantName());

        ApplicationDTO createdApplication = applicationService.createApplication(application);

        ApiResponse<ApplicationDTO> response = ApiResponse.<ApplicationDTO>builder()
                .data(createdApplication)
                .message("Application submitted successfully")
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDTO>> getApplicationById(@PathVariable Long id) {
        log.debug("GET /api/v1/applications/{} - Fetching application details", id);

        ApplicationDTO application = applicationService.getApplicationById(id);

        ApiResponse<ApplicationDTO> response = ApiResponse.<ApplicationDTO>builder()
                .data(application)
                .build();

        return ResponseEntity.ok(response);
    }
}
