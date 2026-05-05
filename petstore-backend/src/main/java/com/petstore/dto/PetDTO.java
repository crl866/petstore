package com.petstore.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PetDTO {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private Integer age;
    private String bio;
    private Long categoryId;
    private String categoryName;
    private String availabilityStatus;
    private List<String> photoUrls;
    private String healthStatus;
    private String healthStatusNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
