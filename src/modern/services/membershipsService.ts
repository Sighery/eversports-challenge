import { MembershipsRepository } from "../repositories/membershipsRepository";
import { MembershipPeriodsRepository } from "../repositories/membershipPeriodsRepository";
import { MembershipWithPeriodsView } from "../views/json/membershipsView";
import { transformToMembershipView } from "../transformers/membershipTransformer";
import { transformToMembershipPeriodView } from "../transformers/membershipPeriodTransformer";
import { Membership } from "../models/membershipModel";
import { MembershipPeriod } from "../models/membershipPeriodModel";

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

  async getMembershipsCount(): Promise<number> {
    return this.membershipsRepo.getCount();
  }

  async addMembership(newModel: Membership): Promise<Membership> {
    return this.membershipsRepo.save(newModel);
  }

  async addMembershipPeriod(
    newModel: MembershipPeriod,
  ): Promise<MembershipPeriod> {
    return this.membershipPeriodsRepo.save(newModel);
  }
}
