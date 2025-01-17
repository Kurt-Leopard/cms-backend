import authModel from "../models/authModel.mjs";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

class authController {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      await authModel.login([email], async (err, result) => {
        if (err) return res.status(500).json({ message: "Error in login" });

        if (result.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Invalid credentials!" });
        }
        const user = result[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid password!" });
        }

        const accessToken = jwt.sign(
          { id: user.id, role: user.role },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          { id: user.id, role: user.role },
          process.env.SECRET_REFRESH_KEY,
          { expiresIn: "1h" }
        );

        res.cookie("accessToken", accessToken, { maxAge: 60000 });

        res.cookie("refreshToken", refreshToken, { maxAge: 604800000 });

        res.status(200).json({
          message: "Login successfully!",
          token: accessToken,
        });
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async register(req, res) {
    const { email, password } = req.body;
    try {
      await authModel.register([email], async (err, result) => {
        if (err) return res.status(500).json({ message: "Error in register" });
        if (result.length > 0) {
          return res
            .status(400)
            .json({ success: false, message: "Email already exists!", result });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = [email, hashedPassword];
        await authModel.create(user, (err, result) => {
          if (err) {
            return res.status(400).json({ message: "Error in register" });
          }
          res.status(200).json({ message: "Register successfully!" });
        });
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async verifyToken(req, res) {
    res.json({ valid: true, message: "Authorized" });
  }
}
export default new authController();
