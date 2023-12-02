const User = require("../models/userModel");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    if (!username || !email || !password) {
      res.status(400);

      throw new Error("Please add all fields");
    }

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      res.status(400);
      throw new Error(
        `User with ${existingUser.username === username ? "username" : "email"} already exists`
      );
    }
    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      response: {
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
        accessToken: generateToken(newUser._id),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, response: err.message });
  }
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || "turtles", {
    expiresIn: "24h",
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, response: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, response: "Incorrect password" });
    }
    res.status(200).json({
      success: true,
      response: {
        username: user.username,
        id: user._id,
        accessToken: generateToken(user._id),
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, response: e.message });
  }
};

exports.protect = async (req, res, next) => {
  const accessToken = req.header("Authorization");

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    try {
      const user = await User.findOne({ accessToken: accessToken });
      if (user) {
        req.user = user;
        next();
      } else {
        console.log("user not");
        res.status(401).json({ success: false, response: "Please log in" });
      }
    } catch (e) {
      console.log("user not");
      res.status(500).json({ success: false, response: e.message });
    }
};
