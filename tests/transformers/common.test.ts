import {
  toISODate,
  parseMembershipState,
  parseMembershipPeriodState,
  parseBillingInterval,
  parsePaymentMethod,
} from "../../src/modern/transformers/common";
import {
  MembershipStateEnum,
  BillingIntervalEnum,
  PaymentMethodEnum,
  MembershipPeriodStateEnum,
} from "../../src/modern/types/common";

describe("toISODate", () => {
  test.each([
    ["2023-02-28T01:20:38.123Z", "2023-02-28"],
    ["0999-02-28T01:20:38.123Z", "0999-02-28"],
  ])("formats %s to %s", (inputStr, expected) => {
    const input = new Date(inputStr);
    const result = toISODate(input);

    expect(result).toEqual(expected);
  });

  it("very future date", () => {
    const input = new Date(12000, 1, 28, 1, 20, 38, 123);
    const result = toISODate(input);

    expect(result).toEqual("12000-02-28");
  });
});

describe("parseMembershipState", () => {
  it("invalid value", () => {
    const raw = "fake";
    expect(() => {
      parseMembershipState(raw);
    }).toThrow("membership state");
  });

  it("valid value", () => {
    const raw = "active";
    const result = parseMembershipState(raw);
    expect(result).toBe(MembershipStateEnum.Active);
  });
});

describe("parseBillingInterval", () => {
  it("invalid value", () => {
    const raw = "fake";
    expect(() => {
      parseBillingInterval(raw);
    }).toThrow("billing interval");
  });

  it("valid value", () => {
    const raw = "monthly";
    const result = parseBillingInterval(raw);
    expect(result).toBe(BillingIntervalEnum.Monthly);
  });
});

describe("parsePaymentMethod", () => {
  it("invalid value", () => {
    const raw = "fake";
    expect(() => {
      parsePaymentMethod(raw);
    }).toThrow("payment method");
  });

  it("null value", () => {
    const raw = null;
    const result = parsePaymentMethod(raw);
    expect(result).toBe(null);
  });

  it("valid value", () => {
    const raw = "credit card";
    const result = parsePaymentMethod(raw);
    expect(result).toBe(PaymentMethodEnum.CreditCard);
  });
});

describe("parseMembershipPeriodState", () => {
  it("invalid value", () => {
    const raw = "fake";
    expect(() => {
      parseMembershipPeriodState(raw);
    }).toThrow("membership period state");
  });

  it("valid value", () => {
    const raw = "issued";
    const result = parseMembershipPeriodState(raw);
    expect(result).toBe(MembershipPeriodStateEnum.Issued);
  });
});
