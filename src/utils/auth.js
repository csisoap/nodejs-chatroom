const { User } = require("../resources/user/user.model");
const { validationResult } = require("express-validator");

const register = async (req, res) => {
  let result = validationResult(req);

  const { username, password } = req.body;

  if (result.errors.length == 0) {
    try {
      const user = await User.create({ username, password });
      res.redirect("/login");
    } catch (e) {
      console.error(e);
      return res.status(400).send({
        message: "Da co loi xay ra. Vui long thu lai",
      });
    }
  }

  result = result.mapped();
  let message;
  for (let field in result) {
    message = result[field].msg;
    break;
  }

  req.flash("error", message);

  res.redirect("/register");
};

const login = async (req, res) => {
  let result = validationResult(req);

  if (result.errors.length > 0) {
    result = result.mapped();
    let message;
    for (let field in result) {
      message = result[field].msg;
      break;
    }

    req.flash("error", message);

    return res.redirect("/login");
  }

  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    req.flash("error", "Không tìm thấy tài khoản này");
    return res.redirect("/login");
  }

  try {
    const match = await user.checkPassword(req.body.password);
    if (!match) {
      req.flash("error", "Sai thông tin mật khẩu");
      return res.redirect("/login");
    }

    return res.status(201).send({ message: "Dang nhap thanh cong" });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  login,
  register,
};
