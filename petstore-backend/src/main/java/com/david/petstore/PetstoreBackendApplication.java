package com.david.petstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PetstoreBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(PetstoreBackendApplication.class, args);
    }
}
