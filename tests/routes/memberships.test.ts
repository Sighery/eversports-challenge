import request from "supertest";
import app from "../../src/app";

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
});
