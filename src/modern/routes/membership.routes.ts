import express from "express";
import {
  getMemberships,
  postMembership,
} from "../controllers/membershipsController";

const router = express.Router();

router.get("/", getMemberships);
router.post("/", postMembership);

export default router;
