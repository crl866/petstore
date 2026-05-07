package com.petstore.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

public enum HealthStatusEnum {
    HEALTHY("Healthy"),
    UNDER_VETERINARY_CARE("Under Veterinary Care"),
    VACCINATION_PENDING("Vaccination Pending");

    private final String displayName;

    HealthStatusEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
