import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return renewToken(req, res, next);
  }

  jwt.verify(accessToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.message === "jwt expired") {
        res.json({ message: "jtw expired" });

        return renewToken(req, res, next);
      } else if (err.message === "jwt malformed") {
        res.clearCookie("accessToken");

        return res.json({ message: "Token malformed" });
      } else {
        return res.json({ message: "Failed to authenticate token" });
      }
    } else {
      req.id = decoded.id;
      next();
    }
  });
};

const renewToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.json({ message: "No Refresh Token" });
  }

  jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY, (err, decoded) => {
    if (err) {
      return res.json({ message: "Invalid Refresh Token" });
    } else {
      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      // res.cookie("accessToken", accessToken, {
      //   maxAge: 60000,
      //   httpOnly: true,
      //   sameSite: "none",
      //   secure: true,
      // });
      res.cookie("accessToken", accessToken, { maxAge: 60000 });
      next();
    }
  });
};
