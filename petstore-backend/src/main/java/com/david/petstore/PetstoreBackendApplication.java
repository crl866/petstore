package com.david.petstore;

import java.net.URI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableCaching
@EntityScan(basePackages = "com.david.petstore.entity")
@EnableJpaRepositories(basePackages = "com.david.petstore.repository")
public class PetstoreBackendApplication {
    public static void main(String[] args) {
        configureDatasourceFromEnvironment();
        // Print resolved DB configuration for debugging in deploy logs
        String envDb = System.getenv("DATABASE_URL");
        String resolved = System.getProperty("spring.datasource.url");
        System.out.println("[startup] DATABASE_URL env: " + (envDb == null ? "<null>" : envDb));
        System.out.println("[startup] Resolved spring.datasource.url: " + (resolved == null ? "<null>" : resolved));

        SpringApplication.run(PetstoreBackendApplication.class, args);
    }

    private static void configureDatasourceFromEnvironment() {
        boolean hasDatasourceEnv = hasText(System.getenv("SPRING_DATASOURCE_URL"))
                || hasText(System.getenv("DATABASE_URL"))
                || hasText(System.getenv("PGHOST"))
                || hasText(System.getenv("PGDATABASE"));

        if (!hasDatasourceEnv) {
            System.setProperty("spring.datasource.url", "jdbc:h2:mem:petstore;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE");
            System.setProperty("spring.datasource.driver-class-name", "org.h2.Driver");
            System.setProperty("spring.datasource.username", "sa");
            System.setProperty("spring.datasource.password", "");
            System.setProperty("spring.jpa.hibernate.ddl-auto", "update");
            System.setProperty("spring.flyway.enabled", "false");
            return;
        }

        if (hasText(System.getenv("SPRING_DATASOURCE_URL"))) {
            return;
        }

        String databaseUrl = System.getenv("DATABASE_URL");
        if (hasText(databaseUrl)) {
            if (databaseUrl.startsWith("jdbc:")) {
                System.setProperty("spring.datasource.url", databaseUrl);
                return;
            }

            if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
                URI uri = URI.create(databaseUrl);
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String query = uri.getQuery();
                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                if (hasText(query)) {
                    jdbcUrl = jdbcUrl + "?" + query;
                }

                System.setProperty("spring.datasource.url", jdbcUrl);

                String userInfo = uri.getUserInfo();
                if (hasText(userInfo) && !userInfo.contains(":")) {
                    if (!hasText(System.getenv("DATABASE_USER")) && !hasText(System.getenv("SPRING_DATASOURCE_USERNAME"))) {
                        System.setProperty("spring.datasource.username", userInfo);
                    }
                }

                if (hasText(userInfo) && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    if (!hasText(System.getenv("DATABASE_USER")) && !hasText(System.getenv("SPRING_DATASOURCE_USERNAME"))) {
                        System.setProperty("spring.datasource.username", parts[0]);
                    }
                    if (!hasText(System.getenv("DATABASE_PASSWORD")) && !hasText(System.getenv("SPRING_DATASOURCE_PASSWORD"))) {
                        System.setProperty("spring.datasource.password", parts[1]);
                    }
                }
                return;
            }
        }

        String host = System.getenv("PGHOST");
        String port = System.getenv("PGPORT");
        String database = System.getenv("PGDATABASE");
        if (hasText(host) && hasText(database)) {
            String jdbcUrl = "jdbc:postgresql://" + host + ":" + (hasText(port) ? port : "5432") + "/" + database;
            System.setProperty("spring.datasource.url", jdbcUrl);
            if (hasText(System.getenv("PGUSER")) && !hasText(System.getenv("DATABASE_USER")) && !hasText(System.getenv("SPRING_DATASOURCE_USERNAME"))) {
                System.setProperty("spring.datasource.username", System.getenv("PGUSER"));
            }
            if (hasText(System.getenv("PGPASSWORD")) && !hasText(System.getenv("DATABASE_PASSWORD")) && !hasText(System.getenv("SPRING_DATASOURCE_PASSWORD"))) {
                System.setProperty("spring.datasource.password", System.getenv("PGPASSWORD"));
            }
        }
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
