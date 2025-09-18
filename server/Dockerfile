# ------------ Build stage ------------
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Maven wrapper and project files first (for caching)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Copy source code
COPY src src

# Set executable permission for Maven wrapper
RUN chmod +x ./mvnw

# Build the fat JAR (skip tests)
RUN ./mvnw clean package -DskipTests

# ------------ Runtime stage ------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
VOLUME /tmp

# Copy the built Spring Boot fat JAR from the build stage
COPY --from=build /app/target/*SNAPSHOT.jar app.jar

# Expose the port
EXPOSE 8080

# Run the application
ENTRYPOINT ["sh", "-c", "echo Listening on $PORT && java -jar /app/app.jar --server.port=$PORT"]
