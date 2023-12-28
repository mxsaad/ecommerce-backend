# Ecommerce Platform Backend

## Overview

This project serves as the backend system for an ecommerce platform. It features a 5NF normalized MySQL database, REST APIs, and a GraphQL API. The APIs provide read-only access, while other operations require a JSON Web Token (JWT) for authentication.

## Tech Stack

- Node.js (v20)
- Express.js
- MySQL
- GraphQL
- JavaScript, HTML, CSS

## How to Run Locally

To run the project locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/mxsaad/ecommerce-backend.git
   cd ecommerce-backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up PlanetScale Database:**
   - Create a PlanetScale account and set up a database.
   - Execute the SQL script `sql/ecommerce.sql` in your PlanetScale database to initialize the schema and data.

4. **Configure Environment Variables:**
   - Create a `.env` file in the root of the project based on the provided `.env.example`.
   - Fill in the necessary details such as database connection credentials and JWT secret.

5. **Run the Project:**
   ```bash
   npm run dev
   ```

6. **Access the APIs:**
   - The REST APIs can be accessed at `http://localhost:3000/api/{endpoint}`.
   - The GraphQL API can be accessed at `http://localhost:3000/graphql`.
