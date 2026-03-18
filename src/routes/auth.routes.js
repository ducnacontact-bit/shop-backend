const express = require("express");
const passport = require("passport");
require("../config/passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// GOOGLE LOGIN
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    // redirect về frontend
    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  },
);

// FACEBOOK LOGIN
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] }),
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  },
);

module.exports = router;
