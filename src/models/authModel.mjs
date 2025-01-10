import { connection } from "../dbconfig/connection.mjs";

class authModel {
  async login(data, callback) {
    const query = "SELECT email , password FROM users WHERE email = ?";
    connection.query(query, data, callback);
  }
  async register(email, callback) {
    const query = "SELECT email FROM users WHERE email = ?";
    connection.query(query, email, callback);
  }

  async create(data, callback) {
    const query = "INSERT INTO users(email, password) VALUES (?, ?)";
    connection.query(query, data, callback);
  }
}

export default new authModel();
