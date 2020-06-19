const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

// register route
router.post("/register", (req, res) => {
  // check if the user already exits already (email differentiator)
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json("email exists");
      // create a new user
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      //hash the password with bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.status(200).json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// login route
router.post("/login", (req, res) => {
  // get login details
  const email = req.body.email;
  const password = req.body.password;

  // check if the email is in db
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json("This user does not exist");
    } else {
      // compare the passwords with bcrypt if same
      bcrypt.compare(password, user.password).then((isSame) => {
        if (isSame) {
          //sign in (jwt) with the details in database(payload)
          const userDetsDb = {
            id: user.id,
            name: user.name,
            email: user.email,
          };

          jwt.sign(
            userDetsDb,
            SECRET,
            { expiresIn: 100000000 },
            (err, token) => {
              res.status(200).json({
                request_success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.status(400).json("wrong password");
        }
      });
    }
  });
});

//get the user with the current token
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
