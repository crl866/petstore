package com.david.petstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetPhotoDTO {
    private Long id;
    private String photoUrl;
    private Integer displayOrder;
}
