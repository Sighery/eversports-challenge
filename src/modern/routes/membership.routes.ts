import express, { Request, Response } from "express";
import { getMemberships } from "../controllers/membershipsController";

const router = express.Router();

router.get("/", getMemberships);

router.post("/", (req: Request, res: Response) => {
  throw new Error("not implemented");
});

export default router;
