const mongoose = require("mongoose");

const connect = (url = "mongodb://localhost:27017/chatroom", opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true });
};

exports.connect = connect;
