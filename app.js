const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = 5001;

const User = require("./UserDetails");

app.use(cors());
app.use(express.json());

const mongoUrl = "mongodb+srv://surajJ:1234567890@synergy.o0vhv.mongodb.net/?retryWrites=true&w=majority&appName=synergy";

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const oldUser = await User.findOne({ username });
    if (oldUser) return res.status(400).json({ error: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received:", {username, password });

  try {
    const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ userId: user._id, message: 'Login successful' });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Node server is running on port 5001");
})