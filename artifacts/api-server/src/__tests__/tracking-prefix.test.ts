import { describe, expect, it, vi } from "vitest";
import {
  companyAcronym,
  generateTrackingId,
  isPrefixConflict,
  prefixCandidates,
  resolveTrackingPrefix,
  withUniquePrefix,
} from "../lib/id";

describe("tenant tracking prefixes", () => {
  it("derives a multi-word company acronym", () => {
    expect(companyAcronym("Freight Solutions Logistics (Pty) Ltd")).toBe("FSL");
  });

  it("replaces the legacy TRK default with the current company acronym", () => {
    expect(resolveTrackingPrefix("TRK", "Freight Solutions Logistics", "freight-solutions-logistics")).toBe("FSL");
    expect(generateTrackingId(resolveTrackingPrefix("TRK", "Freight Solutions Logistics"))).toMatch(/^FSL-[A-Z2-9]{3}-[A-Z2-9]{4}$/);
  });

  it("preserves a prefix deliberately configured by the tenant", () => {
    expect(resolveTrackingPrefix("FAST", "Freight Solutions Logistics")).toBe("FAST");
  });
});
const prefixConflict = () =>
  Object.assign(
    new Error('duplicate key value violates unique constraint "businesses_tracking_id_prefix_unique"'),
    { code: "23505", constraint: "businesses_tracking_id_prefix_unique" },
  );

describe("tracking prefix collision handling", () => {
  it("builds valid, unique candidates starting with the base", () => {
    const c = prefixCandidates("LOG");
    expect(c.slice(0, 3)).toEqual(["LOG", "LOGA", "LOGB"]);
    expect(new Set(c).size).toBe(c.length);
    expect(c.every((p) => /^[A-Z]{3,5}$/.test(p))).toBe(true);
  });

  it("falls back to OLY when the base is unusable", () => {
    expect(prefixCandidates("1")[0]).toBe("OLY");
  });

  it("uses the base prefix when it is free", async () => {
    const attempt = vi.fn(async (p: string) => p);
    const out = await withUniquePrefix("LOG", attempt);
    expect(out.prefix).toBe("LOG");
    expect(attempt).toHaveBeenCalledTimes(1);
  });

  it("uses the next variant when LOG is already taken", async () => {
    const taken = new Set(["LOG"]);
    const out = await withUniquePrefix("LOG", async (p) => {
      if (taken.has(p)) throw prefixConflict();
      return p;
    });
    expect(out.prefix).toBe("LOGA");
  });

  it("keeps going through repeated collisions", async () => {
    const taken = new Set(["LOG", "LOGA", "LOGB"]);
    const out = await withUniquePrefix("LOG", async (p) => {
      if (taken.has(p)) throw prefixConflict();
      return p;
    });
    expect(out.prefix).toBe("LOGC");
  });

  it("does not retry on unrelated errors", async () => {
    const attempt = vi.fn(async () => {
      throw new Error("db down");
    });
    await expect(withUniquePrefix("LOG", attempt)).rejects.toThrow("db down");
    expect(attempt).toHaveBeenCalledTimes(1);
  });

  it("does not treat a duplicate email as a prefix conflict", () => {
    const emailDup = Object.assign(new Error("duplicate key"), {
      code: "23505",
      constraint: "users_email_unique",
    });
    expect(isPrefixConflict(emailDup)).toBe(false);
  });

  it("detects a prefix conflict wrapped in a cause", () => {
    expect(isPrefixConflict(new Error("Failed query", { cause: prefixConflict() }))).toBe(true);
  });

  it("gives up after the attempt limit", async () => {
    await expect(
      withUniquePrefix("LOG", async () => { throw prefixConflict(); }, isPrefixConflict, 3),
    ).rejects.toThrow("No free tracking prefix");
  });

  it("does not change existing prefixes or the ID format", () => {
    expect(resolveTrackingPrefix("LOG", "Logistics Co")).toBe("LOG");
    expect(generateTrackingId("LOG")).toMatch(/^LOG-[A-Z2-9]{3}-[A-Z2-9]{4}$/);
  });
});