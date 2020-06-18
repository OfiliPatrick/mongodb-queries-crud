const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");

require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = process.env.MONGO_URI;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB is up and running"))
  .catch((err) => console.log(err));

const users_route = require("./routes/users.routes");
const profiles_route = require("./routes/profiles.routes");

app.use("/api/users", users_route);
app.use("/api/profiles", profiles_route);

const PORT = process.env.PORT || 5000;

//passport config(invoke after connecting to db, requiring the routes and then using them)
require("./config/passport")(passport);

app.get("/", (req, res) => {
  res.send("Root Endpoint");
});

app.listen(PORT, () => {
  console.log(`server is good to go at ${PORT}`);
});
