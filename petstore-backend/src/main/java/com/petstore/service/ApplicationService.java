package com.petstore.service;

import com.petstore.dto.ApplicationDTO;
import com.petstore.entity.AdoptionApplication;
import com.petstore.entity.ApplicationStatusEnum;
import com.petstore.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public Page<ApplicationDTO> getApplicationsByStatus(ApplicationStatusEnum status, Pageable pageable) {
        log.debug("Fetching applications with status: {}", status);
        Page<AdoptionApplication> applications = applicationRepository.findByStatusOrderBySubmittedAtDesc(status,
                pageable);
        return applications.map(this::convertToDTO);
    }

    public ApplicationDTO getApplicationById(Long id) {
        log.debug("Fetching application by ID: {}", id);
        AdoptionApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + id));
        return convertToDTO(application);
    }

    public ApplicationDTO createApplication(AdoptionApplication application) {
        log.info("Creating new adoption application for: {}", application.getApplicantName());
        AdoptionApplication savedApplication = applicationRepository.save(application);
        return convertToDTO(savedApplication);
    }

    public ApplicationDTO updateApplicationStatus(Long id, ApplicationStatusEnum newStatus, String notes) {
        log.info("Updating application {} status to: {}", id, newStatus);
        AdoptionApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + id));

        application.setStatus(newStatus);
        if (notes != null) {
            application.setAdminNotes(notes);
        }

        AdoptionApplication updatedApplication = applicationRepository.save(application);
        return convertToDTO(updatedApplication);
    }

    private ApplicationDTO convertToDTO(AdoptionApplication application) {
        return ApplicationDTO.builder()
                .id(application.getId())
                .applicantName(application.getApplicantName())
                .email(application.getEmail())
                .address(application.getAddress())
                .homeType(application.getHomeType())
                .formAnswers(application.getFormAnswers())
                .status(application.getStatus().getDisplayName())
                .adminNotes(application.getAdminNotes())
                .submittedAt(application.getSubmittedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
