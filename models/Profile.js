const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },

  skills: {
    type: [String],
    required: true
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model("profiles", profileSchema);

module.exports = Profile;
