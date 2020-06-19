const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Profile = require("../models/Profile");
const { route } = require("./users.routes");
const { session } = require("passport");
const User = require("../models/User");
const { Router } = require("express");

// Get my profile
router.get(
  "/my-profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "email"])
      .then((profile) => {
        //if no profile
        if (!profile) {
          return res.status(404).json("you dont have a profile");
        } else {
          // output profile
          res.json(profile);
        }
      })
      .catch((err) => console.log(err));
  }
);

//Get all profiles
router.get(
  "/get-all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.find()
      .populate("user", ["name", "email"])
      .then((profiles) => {
        //if no profiles
        if (profiles.length == 0) {
          return res.status(404).json("no profiles");
        } else {
          // output profiles
          res.json(profiles);
        }
      })
      .catch((err) => console.log(err));
  }
);

//Get a particular user's profile (by a parameter -company)
router.get("/bycompany/:G", (req, res) => {
  Profile.findOne({ company: req.params.G })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        return res.status(404).json("no profile for this user");
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

// Create/Update profile
router.post(
  "/create-profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    newProfile = {
      user: req.user.id,
      company: req.body.company,
      location: req.body.location,
      skills: req.body.skills,
    };

    Profile.findOne({ user: req.user.id }).then((profile) => {
      //if profile already present
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: newProfile },
          { new: true }
        ).then((profile) => {
          res.json(profile);
        });
      } else {
        // create new one
        new Profile(newProfile).save().then((profile) => res.json(profile));
      }
    });
  }
);

// add new entry to container e.g skills
router.post(
  "/add-skill",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newSkill = req.body.skill.toString();
      // Add to skill array
      profile.skills.unshift(newSkill);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

// Delete my profile
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

//testing profile endpoint
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    res.json(req.user.id);
  }
);

module.exports = router;
