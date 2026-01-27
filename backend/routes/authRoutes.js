const router = require("express").Router();
const passport = require("passport");
const { loginSuccess } = require("../controllers/authController");

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }),
  loginSuccess
);

module.exports = router;
