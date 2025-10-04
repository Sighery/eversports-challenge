import { Membership } from "../models/membershipModel";
import {
  parseMembershipState,
  parsePaymentMethod,
  parseBillingInterval,
} from "./common";

export function parseMembership(raw: Record<string, unknown>): Membership {
  return {
    id: Number(raw.id),
    uuid: String(raw.uuid),
    name: String(raw.name),
    userId: Number(raw.userId),
    recurringPrice: Number(raw.recurringPrice),
    validFrom: new Date(String(raw.validFrom)),
    validUntil: new Date(String(raw.validUntil)),
    state: parseMembershipState(raw.state),
    assignedBy: String(raw.assignedBy),
    paymentMethod: parsePaymentMethod(raw.paymentMethod),
    billingInterval: parseBillingInterval(raw.billingInterval),
    billingPeriods: Number(raw.billingPeriods),
  };
}
