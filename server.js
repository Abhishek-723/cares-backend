require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const bodyParser = require("body-parser");
// var fs = require('file-system');
const connUri = process.env.MONGO_LOCAL_CONN_URL;
let PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./src/middlewares/passport")(passport);

mongoose.promise = global.Promise;
mongoose.connect(connUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB connection established successfully!")
);
connection.on("error", (err) => {
  console.log("MongoDB connection error." + err);
  process.exit();
});

// if (process.env.NODE_ENV == "production") {
//   app.use(express.static("frontend/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "/frontend/build", "index.html"));
//   });
// }

app.use(passport.initialize());
app.use(passport.session());
require("./src/middlewares/jwt")(passport);
require("./src/routes/index")(app);

app.listen(PORT, () =>
  console.log("Server running on http://localhost:" + PORT + "/")
);
