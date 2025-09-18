# ------------ Build stage ------------
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Maven files first for dependency caching
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Copy source
COPY src src

# Set execution permission for Maven wrapper
RUN chmod +x ./mvnw

# Build the application (skip tests for speed)
RUN ./mvnw clean package -DskipTests

# ------------ Runtime stage ------------
FROM eclipse-temurin:17-jdk
WORKDIR /app
VOLUME /tmp

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application with memory limits
ENTRYPOINT ["java", "-Xmx256m", "-Xms128m", "-jar", "/app.jar"]
