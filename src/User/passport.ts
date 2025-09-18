import passport from "passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { db } from "..";
import {Request as ExpressRequest} from 'express'

passport.use(
  new Strategy(
    {
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      callbackURL: process.env.CALLBACK_URL_PASSPORT,
      passReqToCallback: true,
    },
    async (
      req:ExpressRequest,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        let user = await db.user.findFirst({
          where: {
            authOId: profile.id,
          },
        });
        if (!user) {
          user = await db.user.create({
            data: {
              authOId: profile.id,
              fullname: profile.displayName,
              email: profile.emails?.[0].value || "notProvided@docscan.com",
              profilePicture:
                profile.photos?.[0].value ||
                "https://icons8.com/icon/tZuAOUGm9AuS/user-default",
            },
          });
        }
        return done(null, user);
      } catch (error: any) {
        done(error);
      }
    }
  )
);
