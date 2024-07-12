import { Sequelize } from "sequelize";
import "dotenv/config";

// Create a new Sequelize instance using database credentials from environment variables
const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: { max: 5 }
  }
);

// Export the connection instance for use in other modules
export default connection;
