const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, {
            message: "Username/email Not  Registered",
          });
        }

        const isMatch = await user.isValidPassword(password);

        return isMatch
          ? done(null, user)
          : done(null, false, { message: "Incorrect Password" });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});
