import memberberships from "../../../data/memberships.json";
import { Membership } from "../../models/membershipModel";
import { MembershipsRepository } from "../membershipsRepository";
import { parseMembership } from "../../transformers/membershipTransformer";
import { toISODate } from "../../transformers/common";

export class MembershipsJsonRepository implements MembershipsRepository {
  async getAll(): Promise<Membership[]> {
    return memberberships.map(parseMembership);
  }
  async getCount(): Promise<number> {
    return memberberships.length;
  }
  async save(newModel: Membership): Promise<Membership> {
    memberberships.push({
      ...newModel,
      validFrom: toISODate(newModel.validFrom),
      validUntil: toISODate(newModel.validUntil),
    });
    return newModel;
  }
}
