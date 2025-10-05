import { UUID } from "../../types/common";

export interface MembershipView {
  id: number;
  uuid: UUID;
  name: string;
  userId: number;
  user?: number;
  recurringPrice: number;
  validFrom: string;
  validUntil: string;
  state: string;
  assignedBy: string;
  paymentMethod: string | null;
  billingInterval: string;
  billingPeriods: number;
}

export interface MembershipPeriodView {
  id: number;
  uuid: UUID;
  membershipId: number;
  start: string;
  end: string;
  state: string;
}

export interface MembershipWithPeriodsView {
  membership: MembershipView;
  periods: MembershipPeriodView[];
}
