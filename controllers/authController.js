import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const signIn = async (req, res) => {
  const { username, password, clientTime } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: "Invalid username or password." });
    }

    const isPasswordCrt = await bcrypt.compare(password, admin.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Validating client time if provided
    if (clientTime) {
      const serverTime = new Date();
      const clientDate = new Date(clientTime);

      if (isNaN(clientDate.getTime())) {
        return res.status(400).json({ message: "Invalid client time format." });
      }

      const timeDifference =
        Math.abs(serverTime.getTime() - clientDate.getTime()) / 1000 / 60;

      // Allow a 5-minute difference
      if (timeDifference > 5) {
        return res.status(400).json({
          message:
            "Timezone mismatch detected. Please synchronize your PC's clock.",
        });
      }
    }

    // Generate JWT Token
    const token = jwt.sign(
      { username: admin.username, _id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ result: admin, token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Something went wrong during login." });
  }
};
