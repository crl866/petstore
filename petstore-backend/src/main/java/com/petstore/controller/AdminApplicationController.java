package com.petstore.controller;

import com.petstore.dto.ApiResponse;
import com.petstore.dto.ApplicationDTO;
import com.petstore.entity.ApplicationStatusEnum;
import com.petstore.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/applications")
@RequiredArgsConstructor
@Slf4j
public class AdminApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ApplicationDTO>>> getApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {

        log.debug("GET /api/v1/admin/applications - Listing applications");

        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationDTO> applications;

        if (status != null && !status.isEmpty()) {
            try {
                ApplicationStatusEnum statusEnum = ApplicationStatusEnum.valueOf(status.toUpperCase());
                applications = applicationService.getApplicationsByStatus(statusEnum, pageable);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status filter: {}", status);
                applications = applicationService.getApplicationsByStatus(ApplicationStatusEnum.PENDING, pageable);
            }
        } else {
            applications = applicationService.getApplicationsByStatus(ApplicationStatusEnum.PENDING, pageable);
        }

        ApiResponse<Page<ApplicationDTO>> response = ApiResponse.<Page<ApplicationDTO>>builder()
                .data(applications)
                .totalCount(applications.getTotalElements())
                .page(page)
                .pageSize(size)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDTO>> getApplicationById(@PathVariable Long id) {
        log.debug("GET /api/v1/admin/applications/{} - Getting application details", id);

        ApplicationDTO application = applicationService.getApplicationById(id);

        ApiResponse<ApplicationDTO> response = ApiResponse.<ApplicationDTO>builder()
                .data(application)
                .build();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationDTO>> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        log.info("PATCH /api/v1/admin/applications/{}/status - Updating status", id);

        String statusStr = request.get("status");
        String notes = request.get("notes");

        try {
            ApplicationStatusEnum newStatus = ApplicationStatusEnum.valueOf(statusStr.toUpperCase());
            ApplicationDTO updatedApplication = applicationService.updateApplicationStatus(id, newStatus, notes);

            ApiResponse<ApplicationDTO> response = ApiResponse.<ApplicationDTO>builder()
                    .data(updatedApplication)
                    .message("Application status updated successfully")
                    .build();

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid status: {}", statusStr);
            throw new IllegalArgumentException("Invalid application status: " + statusStr);
        }
    }
}
