const User = require("../models/User");
const bcrypt = require("bcrypt");
exports.register = async (req, res, next) => {
  try {
    const email = req.body.email;
    const fullname = req.body.fullname;
    const phone = req.body.phone;
    const password = req.body.password;
    User.findOne({ email: email }).then((userDoc) => {
      if (userDoc) {
        return res.status(201).json("false");
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email: email,
          fullname: fullname,
          phone: phone,
          password: hashedPassword,
        });
        user.save();
      });
      return res.status(200).json("true");
    });
  } catch (err) {
    next(err);
  }
};
exports.singIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then((user) => {
      if (!user) {
        return res.status(201).json("faile");
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          return res.status(200).json(user);
        }
      });
    });
  } catch (err) {
    next(err);
  }
};
exports.getSingIn = async (req, res, next) => {
  try {
    res.send(req.session.user);
  } catch (err) {
    next(err);
  }
};
