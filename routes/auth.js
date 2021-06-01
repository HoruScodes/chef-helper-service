const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) {
    return res.status(400).send("Email Already Exist");
  }

  const hash = bcrypt.hashSync(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    role: "admin",
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(401).send(error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send("Invalid Email and or Password");
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).send("Invalid Email and or Password");
  }

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  res
    .header("auth-token", token)
    .send({ user: user._id, name: user.name, email: user.email, token: token });

  // return res.send({ user: user._id, name: user.name, email: user.email });
});

module.exports = router;
