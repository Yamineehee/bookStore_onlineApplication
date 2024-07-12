import User from "../models/userM.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class userC {
  async register(req, res) {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const hash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, password: hash, role });
      res.status(201).json(newUser);
    } catch (err) {
      console.error("Error registering user:", err); // Log the detailed error
      res.status(500).json({ message: err.message });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user });
    } catch (err) {
      console.error("Error logging in user:", err); // Log the detailed error
      res.status(500).json({ message: err.message });
    }
  }

  // other methods...
}

export default new userC();
