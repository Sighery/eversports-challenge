import { v4 as uuidv4 } from "uuid";

export type UUID = ReturnType<typeof uuidv4>;

export enum MembershipStateEnum {
  Active = "active",
  Pending = "pending",
  Expired = "expired",
}
export type MembershipState = MembershipStateEnum;

export enum PaymentMethodEnum {
  CreditCard = "credit card",
  Cash = "cash",
}
export type PaymentMethod = PaymentMethodEnum | null;

export enum BillingIntervalEnum {
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
}
export type BillingInterval = BillingIntervalEnum;

export enum MembershipPeriodStateEnum {
  Issued = "issued",
  Planned = "planned",
}
export type MembershipPeriodState = MembershipPeriodStateEnum;
