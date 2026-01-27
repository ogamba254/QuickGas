const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const connectDB = require("./config/db");
const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const gasRoutes = require("./routes/gasRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));

app.use(session({
  secret: "gas_secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/gas", gasRoutes);
app.use("/api/orders", orderRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
