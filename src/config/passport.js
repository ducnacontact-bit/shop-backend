// const passport = require("passport")
// const GoogleStrategy = require("passport-google-oauth20").Strategy
// const FacebookStrategy = require("passport-facebook").Strategy
// const { PrismaClient } = require("@prisma/client")

// const prisma = new PrismaClient()

// // GOOGLE LOGIN
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback"
//     },
//     async (accessToken, refreshToken, profile, done) => {

//       let user = await prisma.user.findFirst({
//         where: {
//           provider: "google",
//           providerId: profile.id
//         }
//       })

//       if (!user) {
//         user = await prisma.user.create({
//           data: {
//             email: profile.emails?.[0]?.value,
//             provider: "google",
//             providerId: profile.id
//           }
//         })
//       }

//       done(null, user)
//     }
//   )
// )

// // FACEBOOK LOGIN
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FB_APP_ID,
//       clientSecret: process.env.FB_APP_SECRET,
//       callbackURL: "/api/auth/facebook/callback",
//       profileFields: ["id","emails","name"]
//     },
//     async (accessToken, refreshToken, profile, done) => {

//       let user = await prisma.user.findFirst({
//         where: {
//           provider: "facebook",
//           providerId: profile.id
//         }
//       })

//       if (!user) {
//         user = await prisma.user.create({
//           data: {
//             email: profile.emails?.[0]?.value,
//             provider: "facebook",
//             providerId: profile.id
//           }
//         })
//       }

//       done(null, user)
//     }
//   )
// )

// module.exports = passport
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// GOOGLE LOGIN
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await prisma.user.findFirst({
          where: {
            provider: "google",
            providerId: profile.id,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0]?.value,
              provider: "google",
              providerId: profile.id,
            },
          });
        }

        done(null, user);
      },
    ),
  );
}

// FACEBOOK LOGIN
if (process.env.FB_APP_ID) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ["id", "emails", "name"],
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await prisma.user.findFirst({
          where: {
            provider: "facebook",
            providerId: profile.id,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0]?.value,
              provider: "facebook",
              providerId: profile.id,
            },
          });
        }

        done(null, user);
      },
    ),
  );
}

module.exports = passport;
