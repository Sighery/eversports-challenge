import { MembershipPeriod } from "../models/membershipPeriodModel";

export interface MembershipPeriodsRepository {
  getAll(): Promise<MembershipPeriod[]>;
  getByMembershipId(membershipId: number): Promise<MembershipPeriod[]>;
  save(newModel: MembershipPeriod): Promise<MembershipPeriod>;
}
