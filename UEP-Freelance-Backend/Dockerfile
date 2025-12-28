# ============================================
# DOCKERFILE FOR SPRING BOOT ON RENDER
# ============================================

# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests -Dmaven.test.skip=true -Dmaven.compiler.failOnError=false

# Run stage
FROM eclipse-temurin:17-alpine
WORKDIR /app
COPY --from=builder /app/target/freelance-platform-1.0.0.jar app.jar

# Render environment
ENV PORT=8080
EXPOSE 8080

# Run Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]