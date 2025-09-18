import express from "express";
import passport from "passport";
import { googleCallback } from "./googleCallback";

const router = express.Router();

router.get(passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);

export default router;
