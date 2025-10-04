import { parseMembershipPeriod } from "../../src/modern/transformers/membershipPeriodTransformer";
import membershipPeriods from "../../src/data/membership-periods.json";
import { MembershipPeriodStateEnum } from "../../src/modern/types/common";

describe("parseMembershipPeriod", () => {
  it("parses raw JSON into a MembershipPeriod model", () => {
    const raw = membershipPeriods[0];

    const period = parseMembershipPeriod(raw);

    expect(period).toEqual({
      id: 1,
      uuid: "123e4567-e89b-12d3-a456-426614174000",
      membership: 1,
      membershipId: undefined,
      start: new Date("2023-01-01T00:00:00.000Z"),
      end: new Date("2023-01-31T00:00:00.000Z"),
      state: MembershipPeriodStateEnum.Issued,
    });
  });
});
