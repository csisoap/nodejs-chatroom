const express = require("express");
const { connect } = require("./utils/db");
const morgan = require("morgan");
const { urlencoded, json } = require("body-parser");
const { login, register } = require("./utils/auth");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const { check, validationResult } = require("express-validator");

const app = express();

app.set("view engine", "ejs");
app.use(cookieParser("nodejs-chatroom"));
app.use(
  session({
    cookie: {
      maxAge: 60000,
    },
  })
);
app.use(flash());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

const registerCheck = [
  check("username")
    .exists()
    .withMessage("Vui lòng nhập tên tài khoản")
    .notEmpty()
    .withMessage("Tên tài khoản không được để trống")
    .isLength({ min: 6 })
    .withMessage("Tên tài khoản phải đủ 6 ký tự"),
  check("password")
    .exists()
    .withMessage("Vui lòng nhập mật khẩu")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải đủ 6 ký tự"),
  check("rePassword")
    .exists()
    .withMessage("Vui lòng nhập xác nhận mật khẩu")
    .notEmpty()
    .withMessage("Phần xác nhận mật khẩu không được để trống")
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Mật khẩu không khớp");
      }
      return true;
    }),
];

const loginCheck = [
  check("username")
    .exists()
    .withMessage("Vui lòng nhập tên tài khoản")
    .notEmpty()
    .withMessage("Tên tài khoản không được để trống"),
  check("password")
    .exists()
    .withMessage("Vui lòng nhập mật khẩu")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống"),
];

app.get("/login", (req, res) => {
  const error = req.flash("error") || "";
  res.render("login", { error });
});
app.get("/register", (req, res) => {
  const error = req.flash("error") || "";
  res.render("register", { error });
});
app.post("/login", loginCheck, login);
app.post("/register", registerCheck, register);

async function start() {
  try {
    await connect();
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (e) {
    console.error(e);
  }
}

exports.start = start;
