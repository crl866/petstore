# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Create non-root user
RUN useradd -m -u 1001 petstore && chown -R petstore:petstore /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/petstore-backend-1.0.0.jar app.jar

USER petstore

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.JarLauncher \
    || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
