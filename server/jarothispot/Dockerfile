# Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
COPY .mvn .mvn
RUN mvn dependency:go-offline -B

# Build app
COPY src ./src
RUN mvn package -DskipTests

# Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0"
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
