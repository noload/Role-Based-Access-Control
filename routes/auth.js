const router = require("express").Router();
const User = require("../models/user.model");

router.get("/login", async (req, res, next) => {
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  res.send("login post");
});

router.get("/register", async (req, res, next) => {
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
  res.send("Logout");
});

module.exports = router;
