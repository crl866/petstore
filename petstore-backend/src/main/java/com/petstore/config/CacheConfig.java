package com.petstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.EnableCaching;

@Configuration
@EnableCaching
public class CacheConfig {
    // Cache configuration is handled via Spring Boot properties
    // See application.properties for cache settings
}
