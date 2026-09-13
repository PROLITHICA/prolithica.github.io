export async function sendEnquiry(data, request = fetch) {
  const response = await request(
    "https://formsubmit.co/ajax/info@prolithica.com",
    {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
    },
  );
  if (!response.ok) throw new Error("Submission was not accepted.");
  const result = await response.json();
  if (result.success !== true && result.success !== "true")
    throw new Error("Submission was not confirmed.");
  return true;
}
