const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
  try {
    const existUser = await User.exists({ email: req.body.email });
    if (existUser) return res.status(401).json({ message: "Email đã tồn tại" });
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "Đăng kí thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ email: "Email không tồn tại" });
    const isPasswordMath = await bcrypt.compare(password, user.password);
    if (!isPasswordMath)
      return res.status(400).json({ password: "Sai mật khẩu" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_client);
    return res.json(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
