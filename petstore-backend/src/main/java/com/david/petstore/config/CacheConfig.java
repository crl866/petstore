package com.david.petstore.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Cache configuration is handled through application.properties
    // spring.cache.type=simple
    // spring.cache.cache-names=categories,pets
}
