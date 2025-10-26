# last-call
Real-time bidding application with microservices architecture

## Features
- Real-time bidding with WebSocket connections
- Microservices architecture for horizontal scalability
- Event-driven communication between services
- Containerized deployment with Docker

## Running the Application

### Server (Backend)
```bash
cd server
docker-compose down -v
mvn clean install -DskipTests
```

### Web (Frontend)
```bash
cd web
npm run dev
docker-compose up --build -d
```