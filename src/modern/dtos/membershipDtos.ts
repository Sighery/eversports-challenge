import { BillingInterval, PaymentMethod } from "../types/common";

export interface CreateMembershipDto {
  name: string;
  recurringPrice: number;
  validFrom?: Date;
  paymentMethod: PaymentMethod;
  billingPeriods: number;
  billingInterval: BillingInterval;
}
