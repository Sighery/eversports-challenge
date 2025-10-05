import { Membership } from "../../../src/modern/models/membershipModel";
import { MembershipsJsonRepository } from "../../../src/modern/repositories/json/membershipsJsonRepository";
import {
  BillingIntervalEnum,
  MembershipStateEnum,
  PaymentMethodEnum,
} from "../../../src/modern/types/common";

describe("MembershipsJsonRepository", () => {
  it("getAll works", async () => {
    const repo = new MembershipsJsonRepository();
    const result = await repo.getAll();

    expect(result).toEqual([
      {
        id: 1,
        uuid: "123e4567-e89b-12d3-a456-426614174000",
        name: "Platinum Plan",
        userId: 2000,
        recurringPrice: 150.0,
        validFrom: new Date("2023-01-01T00:00:00.000Z"),
        validUntil: new Date("2023-12-31T00:00:00.000Z"),
        state: MembershipStateEnum.Active,
        assignedBy: "Admin",
        paymentMethod: PaymentMethodEnum.CreditCard,
        billingInterval: BillingIntervalEnum.Monthly,
        billingPeriods: 12,
      },
      {
        id: 2,
        uuid: "123e4567-e89b-12d3-a456-426614174001",
        name: "Gold Plan",
        userId: 2000,
        recurringPrice: 100.0,
        validFrom: new Date("2023-02-01T00:00:00.000Z"),
        validUntil: new Date("2023-12-31T00:00:00.000Z"),
        state: MembershipStateEnum.Active,
        assignedBy: "Admin",
        paymentMethod: PaymentMethodEnum.Cash,
        billingInterval: BillingIntervalEnum.Monthly,
        billingPeriods: 2,
      },
      {
        id: 3,
        uuid: "123e4567-e89b-12d3-a456-426614174002",
        name: "Gold Plan",
        userId: 2000,
        recurringPrice: 100.0,
        validFrom: new Date("2023-02-01T00:00:00.000Z"),
        validUntil: new Date("2023-12-31T00:00:00.000Z"),
        state: MembershipStateEnum.Active,
        assignedBy: "Admin",
        paymentMethod: null,
        billingInterval: BillingIntervalEnum.Monthly,
        billingPeriods: 6,
      },
    ]);
  });

  it("getCount works", async () => {
    const repo = new MembershipsJsonRepository();
    const result = await repo.getCount();

    expect(result).toEqual(3);
  });

  it("save works", async () => {
    const repo = new MembershipsJsonRepository();

    const data: Membership = {
      id: 200,
      uuid: "d89eed95-aa26-458d-aff0-15f34891d56d",
      name: "Testing Plan",
      userId: 4000,
      recurringPrice: 200,
      validFrom: new Date("2020-01-01"),
      validUntil: new Date("2020-12-31"),
      state: MembershipStateEnum.Expired,
      assignedBy: "Admin",
      paymentMethod: PaymentMethodEnum.CreditCard,
      billingInterval: BillingIntervalEnum.Yearly,
      billingPeriods: 2,
    };
    const result = await repo.save(data);

    expect(result).toEqual(data);

    const records = await repo.getAll();
    expect(records).toContainEqual(data);
  });
});
