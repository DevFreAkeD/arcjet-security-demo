import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";

/**
 * Arcjet Protection API Route
 *
 * This route demonstrates Arcjet's protection capabilities, including bot detection, rate limiting, and other security measures.
 *
 * The route shows how to:
 * 1. Set up Arcjet protection rules
 * 2. Handle requests that fail security checks
 * 3. Allow legitimate requests that pass all security checks
 *
 ---------------------------------------------------------------------------------------------------------------
 *
 * GET /api/arcjet
 * 
 * This route handles GET requests and uses Arcjet to apply protection.
 * 
 * - Initializes Arcjet protection with specified rules.
 * - Uses "LIVE" mode to actively block suspicious and abusive requests.
 * - Logs the Arcjet decision for each request.
 * - If any security check fails, responds with 429 Too Many Requests for rate limit violations or 403 Forbidden for other denials.
 * - If all security checks pass, responds with 200 OK status.
 * 
 * POST /api/arcjet
 * 
 * This route handles POST requests and uses Arcjet to apply protection.
 * 
 * - Initializes Arcjet protection with specified rules.
 * - Uses "LIVE" mode to actively block suspicious and abusive requests.
 * - If any security check fails, responds with 403 Forbidden status.
 * - If all security checks pass, responds with 200 OK status.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Response} - The response object indicating whether the request is allowed or blocked.
 */

export async function GET(req: Request) {
  const decision = await aj.protect(req);

  console.log("Arcjet Decision:", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Request Denied",
        reason: decision.reason,
      },
      {
        // Returns 429 (Too Many Requests) if it's a rate limit violation, 403 (Forbidden) for all other denials such as bot traffic
        status: decision.reason.isRateLimit() ? 429 : 403,
      }
    );
  }

  return NextResponse.json({
    message: "Hello from Arjet!",
    decision,
  });
}

export async function POST(req: Request) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "[!] Request Denied.",
        reason: decision.reason,
        // details: decision,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "[+] Data processed successfully.",
    decision,
  });
}