import { UUID, MembershipPeriodState } from "../types/common";

export interface MembershipPeriod {
  id: number;
  uuid: UUID;
  membership: number;
  membershipId?: number;
  start: Date;
  end: Date;
  state: MembershipPeriodState;
}
