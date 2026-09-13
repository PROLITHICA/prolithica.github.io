import test from "node:test";
import assert from "node:assert/strict";
import { sendEnquiry } from "../scripts/enquiry.mjs";

test("accepts a service-confirmed submission", async () => {
  assert.equal(
    await sendEnquiry(new FormData(), async () => ({
      ok: true,
      json: async () => ({ success: "true" }),
    })),
    true,
  );
});
test("does not claim success when the service rejects a request", async () => {
  await assert.rejects(
    sendEnquiry(new FormData(), async () => ({
      ok: true,
      json: async () => ({ success: "false" }),
    })),
  );
});
test("rejects HTTP failure even when a response body claims success", async () => {
  await assert.rejects(
    sendEnquiry(new FormData(), async () => ({
      ok: false,
      json: async () => ({ success: true }),
    })),
  );
});
test("propagates connection failure so the page can preserve the enquiry and offer retry", async () => {
  await assert.rejects(
    sendEnquiry(new FormData(), async () => {
      throw new Error("offline");
    }),
    /offline/,
  );
});
