### Overview

The Beauty Salon app is a comprehensive full-stack application designed for managing beauty salon services. It consists of a frontend built with Vue, TypeScript, and Vite, and a backend developed using Node.js, TypeScript, Express.js, TRPC, and PostgreSQL.

## Key Features

-   User Authentication: Secure JWT-based authentication for login, password reset, and account creation.
-   Role Management: Supports three different user roles: client, specialist, and owner.
-   Appointment Scheduling: Allows users to schedule and manage appointments.
-   Business and Specialities Management: Users can add businesses and define specialities.
-   Database Management: Includes migrations for database schema management and seeding with initial data.
-   Development and Testing: Comprehensive scripts for running development servers and tests.

### Installation

## Backend Setup

## Install Dependencies:

npm install

## Create PostgreSQL Databases:

Ensure you have PostgreSQL installed and create a main database and a test database.

## Configure Environment Variables:

# Create a .env file in the root of the project and add the following environment variables:

NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/database_name
TEST_DATABASE_URL=postgres://user:password@localhost:5432/test_database_name
TOKEN_KEY=your_secret_key

## Database Migrations

# To manage the database schema, navigate to the backend directory and run the migration command:

cd server/
npm run migrate:latest
Running the Application

# To start the development server, run:

npm run dev
This will run the application on localhost:3000.

# Running Tests

To execute the tests, use the following command:
npm run test

## Scripts

Here are some key scripts defined in the package.json:

npm run build: Compiles the TypeScript code and prepares it for production.
npm run dev: Starts the development server.
npm run migrate:latest: Runs the latest database migrations.
npm run reset-db: Drops and recreates the database, then runs migrations.
npm run test: Runs the test suite.
npm run lint: Lints the codebase using ESLint.
npm run format: Formats the code using Prettier.

## License

This project is licensed under the MIT License. For more details, see the LICENSE file.