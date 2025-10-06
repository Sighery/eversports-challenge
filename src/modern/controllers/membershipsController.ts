import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { MembershipsService } from "../services/membershipsService";
import { MembershipsJsonRepository } from "../repositories/json/membershipsJsonRepository";
import { MembershipPeriodsJsonRepository } from "../repositories/json/membershipPeriodsJsonRepository";
import { parseCreateMembershipDto } from "../transformers/membershipDtoTransformer";
import {
  BillingIntervalEnum,
  MembershipPeriodStateEnum,
  MembershipStateEnum,
} from "../types/common";
import { Membership } from "../models/membershipModel";
import { MembershipPeriod } from "../models/membershipPeriodModel";
import { MembershipWithPeriodsView } from "../views/json/membershipsView";
import { transformToMembershipView } from "../transformers/membershipTransformer";
import { transformToMembershipPeriodView } from "../transformers/membershipPeriodTransformer";

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

/**
 * create a new membership
 */
export async function postMembership(req: Request, res: Response) {
  const data = parseCreateMembershipDto(req.body);
  const userId = 2000;

  // TODO: Likely makes sense to move all these checks to a validator that
  // can more easily be unit tested
  if (!data.name || !data.recurringPrice) {
    return res.status(400).json({ message: "missingMandatoryFields" });
  }

  if (data.recurringPrice < 0) {
    return res.status(400).json({ message: "negativeRecurringPrice" });
  }

  // NOTE: This error message doesn't match what this checks?
  if (data.recurringPrice > 100 && data.paymentMethod === "cash") {
    return res.status(400).json({ message: "cashPriceBelow100" });
  }

  if (data.billingInterval === BillingIntervalEnum.Monthly) {
    if (data.billingPeriods > 12) {
      return res
        .status(400)
        .json({ message: "billingPeriodsMoreThan12Months" });
    }
    if (data.billingPeriods < 6) {
      return res.status(400).json({ message: "billingPeriodsLessThan6Months" });
    }
  } else if (data.billingInterval === BillingIntervalEnum.Yearly) {
    if (data.billingPeriods > 3) {
      if (data.billingPeriods > 10) {
        return res
          .status(400)
          .json({ message: "billingPeriodsMoreThan10Years" });
      } else {
        // NOTE: This case doesn't match what the error message is saying.
        // Possible bug?
        return res
          .status(400)
          .json({ message: "billingPeriodsLessThan3Years" });
      }
    }
    // NOTE: This makes it so the weekly interval is always invalid?
  } else {
    return res.status(400).json({ message: "invalidBillingPeriods" });
  }

  const validFrom = data.validFrom || new Date();
  const validUntil = new Date(validFrom);
  if (data.billingInterval === BillingIntervalEnum.Monthly) {
    validUntil.setMonth(validFrom.getMonth() + data.billingPeriods);
  } else if (data.billingInterval === BillingIntervalEnum.Yearly) {
    validUntil.setMonth(validFrom.getMonth() + data.billingPeriods * 12);
  } else if (data.billingInterval === BillingIntervalEnum.Weekly) {
    validUntil.setDate(validFrom.getDate() + data.billingPeriods * 7);
  }

  let state = MembershipStateEnum.Active;
  if (validFrom > new Date()) {
    state = MembershipStateEnum.Pending;
  }
  if (validUntil < new Date()) {
    state = MembershipStateEnum.Expired;
  }

  const newMembership: Membership = {
    id: (await membershipsService.getMembershipsCount()) + 1,
    uuid: uuidv4(),
    name: data.name,
    state: state,
    validFrom: validFrom,
    validUntil: validUntil,
    // NOTE: Original code here adds a user field, but the JSON uses userId
    userId: userId,
    // NOTE: Also missing assignedBy? This might be auto-filled with DB use
    assignedBy: "Admin",
    paymentMethod: data.paymentMethod,
    recurringPrice: data.recurringPrice,
    billingPeriods: data.billingPeriods,
    billingInterval: data.billingInterval,
  };
  await membershipsService.addMembership(newMembership);

  const membershipPeriods: MembershipPeriod[] = [];
  let periodStart = validFrom;
  for (let i = 0; i < data.billingPeriods; i++) {
    const validFrom = periodStart;
    const validUntil = new Date(validFrom);
    if (data.billingInterval === BillingIntervalEnum.Monthly) {
      validUntil.setMonth(validFrom.getMonth() + 1);
    } else if (data.billingInterval === BillingIntervalEnum.Yearly) {
      validUntil.setMonth(validFrom.getMonth() + 12);
    } else if (data.billingInterval === BillingIntervalEnum.Weekly) {
      validUntil.setDate(validFrom.getDate() + 7);
    }
    const period: MembershipPeriod = {
      id: i + 1,
      uuid: uuidv4(),
      membershipId: newMembership.id,
      // NOTE: JSON has membership as well but it's not set in code. Possible bug?
      membership: newMembership.id,
      start: validFrom,
      end: validUntil,
      state: MembershipPeriodStateEnum.Planned,
    };
    await membershipsService.addMembershipPeriod(period);
    membershipPeriods.push(period);
    periodStart = validUntil;
  }

  const result: MembershipWithPeriodsView = {
    membership: transformToMembershipView(newMembership),
    periods: membershipPeriods.map(transformToMembershipPeriodView),
  };
  // NOTE: For absolute backwards compatibility, replace the userId field with
  // user field. Really ugly hack but I suspect this is a bug
  result.membership.user = result.membership.userId;
  delete result.membership.user;
  res.status(201).json(result);
}
