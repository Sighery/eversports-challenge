import { MembershipPeriod } from "../../../src/modern/models/membershipPeriodModel";
import { MembershipPeriodStateEnum } from "../../../src/modern/types/common";

describe("MembershipPeriodsJsonRepository", () => {
  it("getAll works", async () => {
    jest.resetModules();
    const { MembershipPeriodsJsonRepository } = await import(
      "../../../src/modern/repositories/json/membershipPeriodsJsonRepository"
    );

    const repo = new MembershipPeriodsJsonRepository();
    const result = await repo.getAll();

    expect(result).toEqual([
      {
        id: 1,
        uuid: "123e4567-e89b-12d3-a456-426614174000",
        membership: 1,
        start: new Date("2023-01-01T00:00:00.000Z"),
        end: new Date("2023-01-31T00:00:00.000Z"),
        state: MembershipPeriodStateEnum.Issued,
      },
      {
        id: 2,
        uuid: "123e4567-e89b-12d3-a456-426614174001",
        membership: 2,
        start: new Date("2023-02-01T00:00:00.000Z"),
        end: new Date("2023-02-28T00:00:00.000Z"),
        state: MembershipPeriodStateEnum.Issued,
      },
      {
        id: 3,
        uuid: "123e4567-e89b-12d3-a456-426614174002",
        membership: 3,
        start: new Date("2023-03-01T00:00:00.000Z"),
        end: new Date("2023-03-31T00:00:00.000Z"),
        state: MembershipPeriodStateEnum.Issued,
      },
    ]);
  });

  it("getByMembershipId empty case", async () => {
    jest.resetModules();
    const { MembershipPeriodsJsonRepository } = await import(
      "../../../src/modern/repositories/json/membershipPeriodsJsonRepository"
    );

    const repo = new MembershipPeriodsJsonRepository();
    const membershipId = 1;
    const result = await repo.getByMembershipId(membershipId);

    expect(result).toEqual([]);
  });

  it("getByMembershipId non-empty case", async () => {
    jest.resetModules();
    jest.mock(
      "../../../src/data/membership-periods.json",
      () => [
        {
          id: 1,
          uuid: "123e4567-e89b-12d3-a456-426614174000",
          membership: 1,
          membershipId: 1,
          start: "2023-01-01",
          end: "2023-01-31",
          state: MembershipPeriodStateEnum.Issued,
        },
      ],
      { virtual: true },
    );
    const { MembershipPeriodsJsonRepository } = await import(
      "../../../src/modern/repositories/json/membershipPeriodsJsonRepository"
    );

    const repo = new MembershipPeriodsJsonRepository();
    const membershipId = 1;
    const result = await repo.getByMembershipId(membershipId);

    expect(result).toEqual([
      {
        id: 1,
        uuid: "123e4567-e89b-12d3-a456-426614174000",
        membership: 1,
        membershipId: 1,
        start: new Date("2023-01-01T00:00:00.000Z"),
        end: new Date("2023-01-31T00:00:00.000Z"),
        state: MembershipPeriodStateEnum.Issued,
      },
    ]);
  });

  it("save works", async () => {
    jest.resetModules();
    const { MembershipPeriodsJsonRepository } = await import(
      "../../../src/modern/repositories/json/membershipPeriodsJsonRepository"
    );

    const repo = new MembershipPeriodsJsonRepository();

    const data: MembershipPeriod = {
      id: 2000,
      uuid: "d89eed95-aa26-458d-aff0-15f34891d56d",
      membership: 200,
      membershipId: 200,
      start: new Date("2020-01-01"),
      end: new Date("2020-12-31"),
      state: MembershipPeriodStateEnum.Issued,
    };
    const result = await repo.save(data);

    expect(result).toEqual(data);

    const records = await repo.getAll();
    expect(records).toContainEqual(data);
  });
});
