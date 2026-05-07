package com.david.petstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetDTO {
    private Long id;
    private String name;
    private String description;
    private CategoryDTO category;
    private List<HealthStatusDTO> healthStatuses;
    private List<PetPhotoDTO> photos;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
