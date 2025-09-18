# Use a JDK image (so you can build and run inside the same container)
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Maven files and download dependencies
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -q -DskipTests dependency:go-offline

# Copy source and build
COPY src src
RUN ./mvnw -B -q -DskipTests package

# Use a lightweight JRE for runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (Render expects PORT env var)
EXPOSE 8080

# Run with Render’s injected $PORT env
CMD ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
