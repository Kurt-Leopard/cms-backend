import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (!err) {
    console.log("Connected to the database!");
  } else {
    console.log("Error connecting to the database: ", err.message);
  }
});

export { connection };
