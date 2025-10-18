# Last Call Microservices Docker Setup

## Quick Start

1. Build services:
```bash
mvn clean package -DskipTests -f gateway-service/pom.xml
mvn clean package -DskipTests -f user-service/pom.xml
mvn clean package -DskipTests -f item-service/pom.xml
mvn clean package -DskipTests -f room-service/pom.xml
```

2. Start all services:
```bash
docker-compose -f docker-compose.yml up -d
```

## Services
- Gateway: http://localhost:8080
- User Service: http://localhost:8081
- Item Service: http://localhost:8082
- Room Service: http://localhost:8083
- PostgreSQL: localhost:5432 (postgres/postgres)
- Kafka: localhost:9092