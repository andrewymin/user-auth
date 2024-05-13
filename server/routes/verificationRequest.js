import express from "express";
///////////// controller functions
import {
  requestCode,
  verifyCode,
  verifyPage,
} from "../controllers/verifyController.js";

const router = express.Router();

///////////// request Code route
router.post("/newCode", requestCode);

///////////// verify Code route
router.post("/verifyCode", verifyCode);

///////////// verify Page Access route
router.get("/verifyPage", verifyPage, (req, res) => {
  // console.log(req.user); // req is from middleware req
  //   console.log(req.tempUser);
  res.status(200).json({ accessPage: { allow: req.tempUser } });
});
export default router;
