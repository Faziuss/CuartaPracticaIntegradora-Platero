import passport from "passport";
import local from "passport-local";
import userModel from "../dao/mongo/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GithubStrategy from "passport-github2";
import Carts from "../dao/mongo/carts.mongo.js";
import { githubClientId, githubClientSecret } from "./config.js";

const manager = new Carts();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            const newCart = await manager.createCart();
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: "",
              email: profile._json.email,
              password: "",
              cart: newCart._id,
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        let user = await userModel.findOne({ email: username });

        try {
          if (user) {
            return done(null, false);
          }

          const newCart = await manager.createCart();

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
          };
          const result = await userModel.create(newUser);
          console.log(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await userModel.findById(id);
  done(null, user);
});

export default initializePassport;
