const User = require("../database/model/user");

console.log(User);

const { createSecretToken } = require("../tokenGeneration/generateToken");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    console.log(req.body);

    // Check if all required fields are provided
    if (!(name && username && email && password)) {
      return res.status(400).send("All input is required");
    }

    // Check if the user already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    // Hash the password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Generate a token
    const token = createSecretToken(user._id);

    // Set the token as a cookie
    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 86400000), // Cookie expires in 1 day
      secure: true, // Cookie will only be sent over HTTPS
      httpOnly: true, // Cookie cannot be accessed via client-side scripts
      sameSite: "None",
    });

    console.log("Cookie set successfully");

    res.json(user);
  } catch (error) {
    console.log("Got an error", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = createUser;
