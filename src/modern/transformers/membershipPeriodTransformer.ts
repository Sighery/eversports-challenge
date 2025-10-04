import { MembershipPeriod } from "../models/membershipPeriodModel";
import { parseMembershipPeriodState } from "./common";

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
