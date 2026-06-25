import sequelize from "../config/database";
import User from "./User";

const syncDatabase = async () => {
  //Try to connect to the database using the credentials I provided and verify that the connection works.
  //   Sequelize attempts to: Reach the PostgreSQL server.
  // --> Log in using the username and password.
  // --> Access the specified database.
  // --> Confirm the connection is valid.
  await sequelize.authenticate();
//   Sequelize will:
// Read all registered models (User, Task, etc.).
// Check whether the corresponding tables exist in the database.
// If a table doesn't exist → create it.
// If a table exists → compare its structure with the model definition.
// Generate the necessary ALTER TABLE statements to make the table match the model.
  await sequelize.sync({ alter: true });
  console.log("Database connected and synced");
};

export { sequelize, User, syncDatabase };
