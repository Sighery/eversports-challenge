import {
  BillingInterval,
  BillingIntervalEnum,
  MembershipPeriodState,
  MembershipPeriodStateEnum,
  MembershipState,
  MembershipStateEnum,
  PaymentMethod,
  PaymentMethodEnum,
} from "../types/common";

export function toISODate(date: Date): string {
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseMembershipState(raw: unknown): MembershipState {
  if (
    !Object.values(MembershipStateEnum).includes(raw as MembershipStateEnum)
  ) {
    throw new Error(`Invalid membership state: ${raw}`);
  }
  return raw as MembershipStateEnum;
}

export function parsePaymentMethod(raw: unknown): PaymentMethod {
  if (raw === null) {
    return raw;
  }

  if (!Object.values(PaymentMethodEnum).includes(raw as PaymentMethodEnum)) {
    throw new Error(`Invalid payment method: ${raw}`);
  }
  return raw as PaymentMethodEnum;
}

export function parseBillingInterval(raw: unknown): BillingInterval {
  if (
    !Object.values(BillingIntervalEnum).includes(raw as BillingIntervalEnum)
  ) {
    throw new Error(`Invalid billing interval: ${raw}`);
  }
  return raw as BillingIntervalEnum;
}

export function parseMembershipPeriodState(
  raw: unknown,
): MembershipPeriodState {
  if (
    !Object.values(MembershipPeriodStateEnum).includes(
      raw as MembershipPeriodStateEnum,
    )
  ) {
    throw new Error(`Invalid membership period state: ${raw}`);
  }
  return raw as MembershipPeriodStateEnum;
}
