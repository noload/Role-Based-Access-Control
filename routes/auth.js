const router = require("express").Router();
const User = require("../models/user.model");
const passport = require("passport");

router.get("/login", ensureNotAuthenticated, async (req, res, next) => {
  res.render("login");
});

router.post(
  "/login",
  ensureNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get("/register", ensureNotAuthenticated, async (req, res, next) => {
  res.render("register");
});
router.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.redirect("auth/register");
    }
    const user = new User(req.body);
    await user.save();
    req.flash("success", `${user.email} registred successfully`);
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

router.get("/logout", async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      // Handle error
    }
    // Handle successful logout
    res.redirect("/");
  });
});

module.exports = router;

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/login");
  }
}

function ensureNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("back");
  } else {
    next();
  }
}
