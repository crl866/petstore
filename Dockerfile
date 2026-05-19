# Root-level fallback Dockerfile for Render.
# It builds the backend from the monorepo when Render uses repo root.

FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

COPY petstore-backend/pom.xml ./pom.xml
RUN mvn -f pom.xml dependency:go-offline

COPY petstore-backend/src ./src
RUN mvn -f pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

RUN useradd -m -u 1001 petstore && chown -R petstore:petstore /app

COPY --from=builder /app/target/petstore-backend-1.0.0.jar app.jar

USER petstore

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
