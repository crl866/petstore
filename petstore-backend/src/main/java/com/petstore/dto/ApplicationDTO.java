package com.petstore.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDTO {
    private Long id;
    private String applicantName;
    private String email;
    private String address;
    private String homeType;
    private JsonNode formAnswers;
    private String status;
    private String adminNotes;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
}
