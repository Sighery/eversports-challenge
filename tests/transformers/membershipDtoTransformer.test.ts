import { parseCreateMembershipDto } from "../../src/modern/transformers/membershipDtoTransformer";
import {
  BillingIntervalEnum,
  PaymentMethodEnum,
} from "../../src/modern/types/common";

describe("parseCreateMembershipDto", () => {
  it("parses request body into DTO model with validFrom", () => {
    const raw = {
      name: "Gold Plan",
      recurringPrice: 120,
      validFrom: "2020-01-01",
      paymentMethod: PaymentMethodEnum.CreditCard,
      billingInterval: BillingIntervalEnum.Monthly,
      billingPeriods: 12,
    };
    const result = parseCreateMembershipDto(raw);

    expect(result).toEqual({
      name: "Gold Plan",
      recurringPrice: 120,
      validFrom: new Date("2020-01-01T00:00:00.000Z"),
      paymentMethod: PaymentMethodEnum.CreditCard,
      billingInterval: BillingIntervalEnum.Monthly,
      billingPeriods: 12,
    });
  });
});
