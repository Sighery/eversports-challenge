import request from "supertest";
import app from "../../src/app";
import { toISODate } from "../../src/modern/transformers/common";

describe("Memberships routes", () => {
  it("GET /memberships returns expected", async () => {
    const res = await request(app).get("/memberships");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        membership: {
          id: 1,
          uuid: "123e4567-e89b-12d3-a456-426614174000",
          name: "Platinum Plan",
          userId: 2000,
          recurringPrice: 150,
          validFrom: "2023-01-01",
          validUntil: "2023-12-31",
          state: "active",
          assignedBy: "Admin",
          paymentMethod: "credit card",
          billingInterval: "monthly",
          billingPeriods: 12,
        },
        periods: [],
      },
      {
        membership: {
          id: 2,
          uuid: "123e4567-e89b-12d3-a456-426614174001",
          name: "Gold Plan",
          userId: 2000,
          recurringPrice: 100,
          validFrom: "2023-02-01",
          validUntil: "2023-12-31",
          state: "active",
          assignedBy: "Admin",
          paymentMethod: "cash",
          billingInterval: "monthly",
          billingPeriods: 2,
        },
        periods: [],
      },
      {
        membership: {
          id: 3,
          uuid: "123e4567-e89b-12d3-a456-426614174002",
          name: "Gold Plan",
          userId: 2000,
          recurringPrice: 100,
          validFrom: "2023-02-01",
          validUntil: "2023-12-31",
          state: "active",
          assignedBy: "Admin",
          paymentMethod: null,
          billingInterval: "monthly",
          billingPeriods: 6,
        },
        periods: [],
      },
    ]);
  });

  it("POST /memberships missingMandatoryFields error", async () => {
    const data = {
      paymentMethod: "cash",
      billingInterval: "monthly",
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(400);

    expect(response.body).toEqual({ message: "missingMandatoryFields" });
  });

  it("POST /memberships negativeRecurringPrice error", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: -100,
      paymentMethod: "cash",
      billingInterval: "monthly",
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(400);

    expect(response.body).toEqual({ message: "negativeRecurringPrice" });
  });

  it("POST /memberships cashPriceBelow100 error", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "cash",
      billingInterval: "monthly",
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(400);

    expect(response.body).toEqual({ message: "cashPriceBelow100" });
  });

  it("POST /memberships billingPeriodsMoreThan12Months error", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      billingInterval: "monthly",
      billingPeriods: 13,
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(400);

    expect(response.body).toEqual({
      message: "billingPeriodsMoreThan12Months",
    });
  });

  it("POST /memberships billingPeriodsLessThan6Months error", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      billingInterval: "monthly",
      billingPeriods: 5,
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(400);

    expect(response.body).toEqual({ message: "billingPeriodsLessThan6Months" });
  });

  it("POST /memberships billingPeriodsMoreThan10Years error", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      billingInterval: "yearly",
      billingPeriods: 12,
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(400);

    expect(response.body).toEqual({ message: "billingPeriodsMoreThan10Years" });
  });

  it("POST /memberships billingPeriodsLessThan3Years error", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      billingInterval: "yearly",
      billingPeriods: 5,
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(400);

    expect(response.body).toEqual({ message: "billingPeriodsLessThan3Years" });
  });

  it("POST /memberships invalidBillingPeriods error", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      billingInterval: "weekly",
      billingPeriods: 5,
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(400);

    expect(response.body).toEqual({ message: "invalidBillingPeriods" });
  });

  it("POST /memberships with monthly interval", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      billingInterval: "monthly",
      billingPeriods: 12,
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(201);

    const currentDate = new Date();
    const validUntil = new Date(currentDate);
    validUntil.setMonth(currentDate.getMonth() + 12);

    expect(Object.keys(response.body)).toEqual(["membership", "periods"]);
    expect(response.body.membership).toEqual({
      id: expect.any(Number),
      uuid: expect.any(String),
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      validFrom: toISODate(currentDate),
      validUntil: toISODate(validUntil),
      state: "active",
      userId: 2000,
      assignedBy: "Admin",
      billingInterval: "monthly",
      billingPeriods: 12,
    });

    const expectedPeriods: Record<string, unknown>[] = [];
    let periodStart = currentDate;
    for (let i = 0; i < 12; i++) {
      const validFrom = periodStart;
      const validUntil = new Date(validFrom);
      validUntil.setMonth(validFrom.getMonth() + 1);
      expectedPeriods.push({
        id: expect.any(Number),
        uuid: expect.any(String),
        membershipId: response.body.membership.id,
        start: toISODate(validFrom),
        end: toISODate(validUntil),
        state: "planned",
      });
      periodStart = validUntil;
    }

    expect(response.body.periods).toEqual(expectedPeriods);
  });

  it("POST /memberships with yearly interval", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      billingInterval: "yearly",
      billingPeriods: 2,
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(201);

    const currentDate = new Date();
    const validUntil = new Date(currentDate);
    validUntil.setMonth(currentDate.getMonth() + 2 * 12);

    expect(Object.keys(response.body)).toEqual(["membership", "periods"]);
    expect(response.body.membership).toEqual({
      id: expect.any(Number),
      uuid: expect.any(String),
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      validFrom: toISODate(currentDate),
      validUntil: toISODate(validUntil),
      state: "active",
      userId: 2000,
      assignedBy: "Admin",
      billingInterval: "yearly",
      billingPeriods: 2,
    });

    const expectedPeriods: Record<string, unknown>[] = [];
    let periodStart = currentDate;
    for (let i = 0; i < 2; i++) {
      const validFrom = periodStart;
      const validUntil = new Date(validFrom);
      validUntil.setMonth(validFrom.getMonth() + 12);
      expectedPeriods.push({
        id: expect.any(Number),
        uuid: expect.any(String),
        membershipId: response.body.membership.id,
        start: toISODate(validFrom),
        end: toISODate(validUntil),
        state: "planned",
      });
      periodStart = validUntil;
    }

    expect(response.body.periods).toEqual(expectedPeriods);
  });

  it("POST /memberships with state pending", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      billingInterval: "yearly",
      billingPeriods: 2,
      validFrom: "8000-01-01",
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(201);

    const currentDate = new Date("8000-01-01");
    const validUntil = new Date(currentDate);
    validUntil.setMonth(currentDate.getMonth() + 2 * 12);

    expect(Object.keys(response.body)).toEqual(["membership", "periods"]);
    expect(response.body.membership).toEqual({
      id: expect.any(Number),
      uuid: expect.any(String),
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      validFrom: toISODate(currentDate),
      validUntil: toISODate(validUntil),
      state: "pending",
      userId: 2000,
      assignedBy: "Admin",
      billingInterval: "yearly",
      billingPeriods: 2,
    });

    const expectedPeriods: Record<string, unknown>[] = [];
    let periodStart = currentDate;
    for (let i = 0; i < 2; i++) {
      const validFrom = periodStart;
      const validUntil = new Date(validFrom);
      validUntil.setMonth(validFrom.getMonth() + 12);
      expectedPeriods.push({
        id: expect.any(Number),
        uuid: expect.any(String),
        membershipId: response.body.membership.id,
        start: toISODate(validFrom),
        end: toISODate(validUntil),
        state: "planned",
      });
      periodStart = validUntil;
    }

    expect(response.body.periods).toEqual(expectedPeriods);
  });

  it("POST /memberships with state expired", async () => {
    const data = {
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      billingInterval: "yearly",
      billingPeriods: 2,
      validFrom: "1000-01-01",
    };
    const response = await request(app)
      .post("/memberships")
      .send(data)
      .expect(201);

    const currentDate = new Date("1000-01-01");
    const validUntil = new Date(currentDate);
    validUntil.setMonth(currentDate.getMonth() + 2 * 12);

    expect(Object.keys(response.body)).toEqual(["membership", "periods"]);
    expect(response.body.membership).toEqual({
      id: expect.any(Number),
      uuid: expect.any(String),
      name: "Gold Plan",
      recurringPrice: 120,
      paymentMethod: "credit card",
      validFrom: toISODate(currentDate),
      validUntil: toISODate(validUntil),
      state: "expired",
      userId: 2000,
      assignedBy: "Admin",
      billingInterval: "yearly",
      billingPeriods: 2,
    });

    const expectedPeriods: Record<string, unknown>[] = [];
    let periodStart = currentDate;
    for (let i = 0; i < 2; i++) {
      const validFrom = periodStart;
      const validUntil = new Date(validFrom);
      validUntil.setMonth(validFrom.getMonth() + 12);
      expectedPeriods.push({
        id: expect.any(Number),
        uuid: expect.any(String),
        membershipId: response.body.membership.id,
        start: toISODate(validFrom),
        end: toISODate(validUntil),
        state: "planned",
      });
      periodStart = validUntil;
    }

    expect(response.body.periods).toEqual(expectedPeriods);
  });
});
