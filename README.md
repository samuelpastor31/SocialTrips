# SocialTrips
SocialTrips is a full-stack mobile and web application. The project is built with React Native for the frontend and Spring Boot for the backend.

## Project Overview
SocialTrips allows users to create, share, and discover travel itineraries. Users can register, log in, edit their profiles, and interact with itineraries by liking and commenting. The app is designed to foster a community of travelers who want to share their experiences and get inspired by others.

### Main Features
- **User Registration & Authentication:** Secure sign-up and login system.
- **Profile Management:** Users can edit their profile information and change their profile picture.
- **Itinerary Creation:** Users can create new travel itineraries, specifying destination, duration, and description.
- **Itinerary Feed:** Browse itineraries created by other users, with country flags and details.
- **Likes & Comments:** Like and comment on itineraries to interact with the community.
- **Search:** Search for itineraries by country or keyword.
- **Responsive Design:** Mobile-first experience with React Native.

## Technologies Used
- **Frontend:** React Native (JavaScript)
- **Backend:** Spring Boot (Java)
- **Database:** MySQL (Dockerized with docker-compose)
- **API Communication:** RESTful API using Axios

## How to Run the Project

### Database (MySQL with Docker)
1. Make sure you have Docker installed.
2. In the project root, run:
   ```bash
   docker-compose up -d
   ```
   This will start a MySQL container as defined in `docker-compose.yml`.

### Backend (Spring Boot)
1. Navigate to the `socialTrips_back` directory.
2. Configure your database connection in `src/main/resources/application.properties` if needed (default values match the Docker setup).
3. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend (React Native)
1. Navigate to the `socialTrips_front` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Metro bundler:
   ```bash
   npm start
   ```
4. Run the app on your emulator or device:
   ```bash
   npm run android
   # or
   npm run ios
   ```

## Demo Video
[Watch the demo on YouTube](https://www.youtube.com/watch?v=DYyyRTnhKdU)

## Authors
- Samuel Pastor (Project Lead & Developer)
