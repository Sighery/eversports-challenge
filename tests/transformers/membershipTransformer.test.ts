import { parseMembership } from "../../src/modern/transformers/membershipTransformer";
import memberships from "../../src/data/memberships.json";
import {
  BillingIntervalEnum,
  MembershipStateEnum,
  PaymentMethodEnum,
} from "../../src/modern/types/common";

describe("parseMembership", () => {
  it("parses raw JSON into a Membership model", () => {
    const raw = memberships[0];

    const membership = parseMembership(raw);

    expect(membership).toEqual({
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
    });
  });
});
