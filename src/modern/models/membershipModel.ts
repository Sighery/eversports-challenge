import {
  UUID,
  MembershipState,
  PaymentMethod,
  BillingInterval,
} from "../types/common";

export interface Membership {
  id: number;
  uuid: UUID;
  name: string;
  userId: number;
  recurringPrice: number;
  validFrom: Date;
  validUntil: Date;
  state: MembershipState;
  assignedBy: string;
  paymentMethod: PaymentMethod;
  billingInterval: BillingInterval;
  billingPeriods: number;
}
