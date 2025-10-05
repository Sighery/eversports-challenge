import { MembershipsRepository } from "../repositories/membershipsRepository";
import { MembershipPeriodsRepository } from "../repositories/membershipPeriodsRepository";
import { MembershipWithPeriodsView } from "../views/json/membershipsView";
import { transformToMembershipView } from "../transformers/membershipTransformer";
import { transformToMembershipPeriodView } from "../transformers/membershipPeriodTransformer";

export class MembershipsService {
  constructor(
    private readonly membershipsRepo: MembershipsRepository,
    private readonly membershipPeriodsRepo: MembershipPeriodsRepository,
  ) {}

  async getMembershipsWithPeriods(): Promise<MembershipWithPeriodsView[]> {
    const result: MembershipWithPeriodsView[] = [];

    const memberships = await this.membershipsRepo.getAll();
    for (const membership of memberships) {
      const periods = await this.membershipPeriodsRepo.getByMembershipId(
        membership.id,
      );
      result.push({
        membership: transformToMembershipView(membership),
        periods: periods.map(transformToMembershipPeriodView),
      });
    }

    return result;
  }
}
