const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  company: {
    type: String,
  },
  location: {
    type: String,
  },

  skills: {
    type: [String],
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model("profiles", profileSchema);

module.exports = Profile;
