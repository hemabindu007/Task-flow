// Imports the Sequelize class from the sequelize package.
// Sequelize is an ORM (Object Relational Mapper) for Node.js.
//instead of using queries we are using this package Sequelize converts JavaScript operations into SQL queries.
import { Sequelize } from "sequelize";
// dotenv loads environment variables from a .env file into process.env. Without dotenv, Node.js cannot automatically read these values.
import dotenv from "dotenv";

// This reads the .env file and stores its values inside process.env, making them accessible throughout the application.
dotenv.config();

// A new Sequelize object is created.

// This object manages:

// Database connection
// Queries
// Models
// Transactions
// Synchronization

// Think of it as the main gateway to the database.
// Start Application-->Load dotenv --> Read .env file -->
// Get DB credentials -->Create Sequelize instance -->
// Connect to PostgreSQL --> Export connection object
const supabaseUrl = process.env.SUPABASE_URL;
console.log('SUPABASEURL:-', supabaseUrl);

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL environment variable is required");
}

const sequelize = new Sequelize(supabaseUrl, {
  dialect: "postgres",
  logging: false,
});

export default sequelize;