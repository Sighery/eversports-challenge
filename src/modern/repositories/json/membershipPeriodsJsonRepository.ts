import membershipPeriods from "../../../data/membership-periods.json";
import { MembershipPeriod } from "../../models/membershipPeriodModel";
import { MembershipPeriodsRepository } from "../membershipPeriodsRepository";
import { parseMembershipPeriod } from "../../transformers/membershipPeriodTransformer";
import { toISODate } from "../../transformers/common";

export class MembershipPeriodsJsonRepository
  implements MembershipPeriodsRepository
{
  async getAll(): Promise<MembershipPeriod[]> {
    return membershipPeriods.map(parseMembershipPeriod);
  }

  async getByMembershipId(membershipId: number): Promise<MembershipPeriod[]> {
    return membershipPeriods
      .map(parseMembershipPeriod)
      .filter((p) => p.membershipId === membershipId);
  }

  async save(newModel: MembershipPeriod): Promise<MembershipPeriod> {
    membershipPeriods.push({
      ...newModel,
      start: toISODate(newModel.start),
      end: toISODate(newModel.end),
    });
    return newModel;
  }
}
