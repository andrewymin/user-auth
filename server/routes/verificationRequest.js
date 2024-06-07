import express from "express";
///////////// controller functions
import {
  requestCode,
  verifyCode,
  verifyPage,
} from "../controllers/verifyController.js";

const router = express.Router();

///////////// verify Page Access route
router.get("/verifyPage", verifyPage, (req, res) => {
  // console.log(req.user); // req is from middleware req
  //   console.log(req.tempUser);
  res.status(200).json({ accessPage: { allow: req.tempUser } });
});

///////////// verify Code route
router.post("/verifyCode", verifyCode);

///////////// request Code route
router.post("/newCode", requestCode);

export default router;
