package com.petstore.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthStatusDTO {
    private Long id;
    private String status;
    private String notes;
    private LocalDateTime updatedAt;
}
