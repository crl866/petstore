package com.david.petstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/v1/pets/**").permitAll()
                .requestMatchers("/api/v1/categories/**").permitAll()
                .requestMatchers("/david/api/v1/pets/**").permitAll()
                .requestMatchers("/david/api/v1/categories/**").permitAll()
                .requestMatchers("/david/api-docs/**").permitAll()
                .requestMatchers("/david/swagger-ui/**").permitAll()
                .requestMatchers("/david/swagger-ui.html").permitAll()
                .anyRequest().permitAll()
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        String corsAllowedOrigins = System.getenv("CORS_ALLOWED_ORIGINS");
        if (corsAllowedOrigins != null && !corsAllowedOrigins.trim().isEmpty()) {
            configuration.setAllowedOrigins(Arrays.stream(corsAllowedOrigins.split(","))
                    .map(String::trim)
                    .filter(origin -> !origin.isEmpty())
                    .toList());
        } else {
            configuration.setAllowedOrigins(List.of(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "https://petstore-frontendd.onrender.com",
                    "https://petstore-front-end.onrender.com"
            ));
        }
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
