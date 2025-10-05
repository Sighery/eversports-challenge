import { MembershipPeriod } from "../models/membershipPeriodModel";
import { MembershipPeriodView } from "../views/json/membershipsView";
import { parseMembershipPeriodState, toISODate } from "./common";

export function parseMembershipPeriod(
  raw: Record<string, unknown>,
): MembershipPeriod {
  return {
    id: Number(raw.id),
    uuid: String(raw.uuid),
    membership: Number(raw.membership),
    membershipId:
      raw.membershipId !== undefined ? Number(raw.membershipId) : undefined,
    start: new Date(String(raw.start)),
    end: new Date(String(raw.end)),
    state: parseMembershipPeriodState(raw.state),
  };
}

export function transformToMembershipPeriodView(
  source: MembershipPeriod,
): MembershipPeriodView {
  if (source.membershipId === undefined || source.membershipId === null) {
    throw new Error("membershipId is required");
  }

  return {
    id: source.id,
    uuid: source.uuid,
    membershipId: source.membershipId,
    start: toISODate(source.start),
    end: toISODate(source.end),
    state: source.state,
  };
}
