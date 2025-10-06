import { CreateMembershipDto } from "../dtos/membershipDtos";
import { parseBillingInterval, parsePaymentMethod } from "./common";

export function parseCreateMembershipDto(
  body: Record<string, unknown>,
): CreateMembershipDto {
  return {
    name: String(body.name),
    recurringPrice: Number(body.recurringPrice),
    validFrom:
      body.validFrom !== undefined
        ? new Date(String(body.validFrom))
        : undefined,
    paymentMethod: parsePaymentMethod(body.paymentMethod),
    billingInterval: parseBillingInterval(body.billingInterval),
    billingPeriods: Number(body.billingPeriods),
  };
}
