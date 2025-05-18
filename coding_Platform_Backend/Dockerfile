# Use Maven with Java 18
FROM maven:3.8.6-eclipse-temurin-18 AS build

WORKDIR /app

# Copy and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Use Java 18 in the final image
FROM eclipse-temurin:18-jdk

WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/notesapp_backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
