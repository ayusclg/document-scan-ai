import express from "express";
import passport from "passport";
import { googleCallback } from "./googleCallback";
import { verifyUser } from "../Middlewares/auth";
import { myProfile } from "./UserController";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/googleCallback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);

router.get("/my",verifyUser,myProfile)

export default router;
