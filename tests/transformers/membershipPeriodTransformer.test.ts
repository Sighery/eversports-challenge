import {
  parseMembershipPeriod,
  transformToMembershipPeriodView,
} from "../../src/modern/transformers/membershipPeriodTransformer";
import membershipPeriods from "../../src/data/membership-periods.json";
import { MembershipPeriod } from "../../src/modern/models/membershipPeriodModel";
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

describe("transformToMembershipPeriodView", () => {
  it("transforms source model into view model", () => {
    const input: MembershipPeriod = {
      id: 1,
      uuid: "123e4567-e89b-12d3-a456-426614174000",
      membership: 1,
      membershipId: 2,
      start: new Date("2023-01-01T00:00:00.000Z"),
      end: new Date("2023-01-31T00:00:00.000Z"),
      state: MembershipPeriodStateEnum.Issued,
    };
    const result = transformToMembershipPeriodView(input);

    expect(result).toEqual({
      id: 1,
      uuid: "123e4567-e89b-12d3-a456-426614174000",
      membershipId: 2,
      start: "2023-01-01",
      end: "2023-01-31",
      state: MembershipPeriodStateEnum.Issued,
    });
  });

  it("missing membershipId throws error", () => {
    const input: MembershipPeriod = {
      id: 1,
      uuid: "123e4567-e89b-12d3-a456-426614174000",
      membership: 1,
      start: new Date("2023-01-01T00:00:00.000Z"),
      end: new Date("2023-01-31T00:00:00.000Z"),
      state: MembershipPeriodStateEnum.Issued,
    };
    expect(() => {
      transformToMembershipPeriodView(input);
    }).toThrow("membershipId");
  });
});
