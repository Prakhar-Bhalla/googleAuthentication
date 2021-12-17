const express = require("express");
const passport = require("./config/passport");
const app = express();

app.use(express.json());
app.use(passport.initialize());

const {register, login} = require("./controllers/auth.controller");

const {body} = require('express-validator');

const userController = require("./controllers/user.controller");

const productController = require("./controllers/product.controller");

passport.serializeUser(function({user, token}, done) {
  done(null, {user, token});
});

passport.deserializeUser(function(user, done) {
  done(err, user);
}); 

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        failureRedirect: '/auth/google/failure'
}),
function (req, res) {
  return res.status(201).json({user : req.user.user, token: req.user.token});
}
);

app.get("/auth/google/failure", (req, res) => {
  console.log("something went wrong");
})

app.post("/register", body("name").notEmpty().withMessage("Name field can't be empty"), body("email").notEmpty().withMessage("Email field can't be empty").bail().isEmail().withMessage("Invalid email"), body("password").notEmpty().withMessage("Password field can't be empty").bail().custom((value) => {
  const isPassword = /^\w{3,}[@$*]+[0-9]+$/.test(value);
  if(!isPassword)
  {
      throw new Error("Password should be of format alphanumeric + special character + numeric");
  }
  if(value.length < 8)
  {
      throw new Error("Password should be of atleast 8 characters");
  }
  return true;
}), register);

app.post("/login", login);

app.use("/users", userController);

app.use("/products", productController);

module.exports = app;