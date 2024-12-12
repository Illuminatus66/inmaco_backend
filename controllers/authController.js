import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const signIn = async (req, res) => {
  const { username, password, clientTime } = req.body;

  try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
          return res.status(404).json({ message: "Admin doesn't exist" });
      }

      const isPasswordCrt = await bcrypt.compare(password, admin.password);
      if (!isPasswordCrt) {
          return res.status(400).json({ message: "Invalid credentials." });
      }

      // Validate timezone offset (we are assuming a 5-minute tolerance period)
      const serverTime = new Date();
      const clientDate = new Date(clientTime);
      const timeDifference = Math.abs(serverTime.getTime() - clientDate.getTime()) / 1000 / 60;

      if (timeDifference > 5) {
          return res.status(400).json({ message: "Timezone mismatch detected. Please synchronize your PC's clock." });
      }

      const token = jwt.sign(
          {
              username: admin.username,
              _id: admin._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
      );

      res.status(200).json({ result: admin, token });
  } catch (error) {
      res.status(500).json("Something went wrong...");
  }
};