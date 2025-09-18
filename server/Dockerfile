# ------------ Build stage ------------
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Maven wrapper and project descriptor first (to leverage Docker layer caching)
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Download dependencies (without sources/tests to keep it fast)
RUN chmod +x mvnw && ./mvnw -B -q -DskipTests dependency:go-offline

# Now copy the actual source
COPY src src

# Build the jar
RUN ./mvnw -B -q -DskipTests package

# ------------ Runtime stage ------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

# Expose port (Render sets $PORT automatically)
EXPOSE 8080

# Run with the Render-injected port
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
