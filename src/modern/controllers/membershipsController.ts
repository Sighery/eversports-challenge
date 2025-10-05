import { Request, Response } from "express";
import { MembershipsService } from "../services/membershipsService";
import { MembershipsJsonRepository } from "../repositories/json/membershipsJsonRepository";
import { MembershipPeriodsJsonRepository } from "../repositories/json/membershipPeriodsJsonRepository";

// TODO: Might be a good idea to initialize elsewhere and pass the service down
const membershipsService = new MembershipsService(
  new MembershipsJsonRepository(),
  new MembershipPeriodsJsonRepository(),
);

/**
 * List all memberships
 */
export async function getMemberships(req: Request, res: Response) {
  const result = await membershipsService.getMembershipsWithPeriods();
  res.status(200).json(result);
}
