# Overview

The Beauty Salon app is a full-stack application used for managing beauty salon services for various businesses. It consists of a frontend built with Vue, TypeScript, and Vite, and a backend developed using Node.js, TypeScript, Express.js, TRPC, and PostgreSQL.

Link to the deployed website: https://wink.ufrnrsgvke15i.eu-central-1.cs.amazonlightsail.com/

## Key Features

-   User Authentication: Secure JWT-based authentication for login, password reset, and account creation.
-   Role Management: Supports three different user roles: client, specialist, and owner.
-   Appointment Scheduling: Allows users to schedule and manage appointments.
-   Business and Specialities Management: Users can add businesses and define specialities.
-   Persolal detail management.
-   Database Management: Includes migrations for database schema management and seeding with initial data.
-   Development and Testing: Comprehensive scripts for running development servers and tests.

# Installation

## Backend Setup

### Install Dependencies:

    npm install

### Create PostgreSQL Databases:

Ensure you have PostgreSQL installed and create a main database and a test database.

### Configure Environment Variables:

#### Create a .env file in the root of the server directory and add the following environment variables:

    DATABASE_URL=postgres://user:password@localhost:5432/database_name
    TEST_DATABASE_URL=postgres://user:password@localhost:5432/test_database_name
    TOKEN_KEY=your_secret_key

### Database Migrations

#### To manage the database schema, navigate to the backend directory and run the migration command:

    npm run migrate:latest

#### To start the development server, run:

    npm run dev

This will run the application on localhost:3000.

#### Running Tests

      npm run test

## Frontend Setup

#### Create a .env file in the root of the client directory and add the following environment variables:

    VITE_API_ORIGIN=http://localhost:3000
    VITE_API_PATH=/api/v1/trpc

#### To start the development server, run:

    npm run dev

This will run the application on http://localhost:5174

#### Running Tests

      npm run test

## CI/CD Pipeline

This project uses GitHub Actions to automate the Continuous Integration and Continuous Deployment (CI/CD) processes. The pipeline is triggered on every push to the repository and includes the following steps:

-   Testing: The pipeline runs all unit, integration, and end-to-end tests to ensure code quality and functionality.
-   Build and Deployment: If the tests pass, the pipeline builds Docker images for the frontend and backend and deploys them to AWS Lightsail.

#### Key Jobs in CI/CD

-   Test: Runs tests and linters for both the frontend and backend. It uses Docker to spin up a PostgreSQL service for integration testing.
-   Build and Deploy: Builds Docker images for the client and server, pushes them to AWS Lightsail, and deploys them. You can find the CI/CD configuration in the .github/workflows directory of the repository.

## Docker Setup

This project is Dockerized to ensure a consistent development environment and to simplify deployment. The setup includes three main services: PostgreSQL, the backend server, and the frontend client.

#### Docker Compose

The docker-compose.yml file defines the following services:

-   postgres: A PostgreSQL database used by the backend.
-   server: The backend API server.
-   client: The frontend application served via Nginx.

#### Running the Application with Docker

To start the application using Docker, run:

    docker compose up --build

This command will:

-   Pull the necessary Docker images for PostgreSQL and Nginx.
-   Build Docker images for the frontend and backend based on the Dockerfiles.
-   Start all services, making the application accessible at http://localhost:3001.

#### Dockerfile Details

-   Backend Dockerfile: Builds the Node.js backend, installs dependencies, and runs the server.
-   Frontend Dockerfile: Builds the frontend assets using Vite and serves them using Nginx.

This setup is designed to work both locally and in production, with environment variables controlling behavior in different environments.

## Screenshots

<img width="963" alt="Screenshot 2024-10-19 at 16 06 47" src="https://github.com/user-attachments/assets/23e97e94-54c9-4719-a681-482198245265">

<img width="961" alt="Screenshot 2024-10-19 at 16 07 03" src="https://github.com/user-attachments/assets/4099f08d-f2fd-4120-be5c-4e456e93d37a">

<img width="868" alt="Screenshot 2024-10-19 at 16 11 24" src="https://github.com/user-attachments/assets/d71441a7-4994-44cd-8d87-4121a8ef00af">

<img width="1347" alt="Screenshot 2024-10-19 at 16 10 35" src="https://github.com/user-attachments/assets/6a226513-9d4c-4653-9302-576f92b48e3e">

#### License

This project is licensed under the MIT License. For more details, see the LICENSE file.
