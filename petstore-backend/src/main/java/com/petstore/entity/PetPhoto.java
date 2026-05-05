package com.petstore.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pet_photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "display_order")
    private Integer displayOrder;
}
