import { aj } from "@/lib/arcjet";
import { fixedWindow, shield } from "@arcjet/next";
import { NextResponse } from "next/server";

/**
 * Shield WAF Protection API Route
 *
 * This route demonstrates Arcjet's Shield WAF protection capabilities.
 * It combines multiple security layers including bot detection, rate limiting,
 * and other protections to secure your API.
 *
 * Shield protection checks for:
 * - Suspicious patterns in request behavior
 * - Known bot signatures
 * - Rate limiting to prevent abuse
 *
 * The route shows how to:
 * 1. Set up Shield protection rules
 * 2. Handle requests that fail security checks
 * 3. Allow legitimate requests that pass all security checks
 *
 ------------------------------------------------------------------------------------------------------------------
 * 
 * GET /api/arcjet/shield-waf-protection
 * 
 * This route handles GET requests and uses Arcjet to apply Shield WAF protection.
 * 
 * - Initializes Shield protection with specified rules.
 * - Uses "LIVE" mode to actively block suspicious and abusive requests.
 * - If any security check fails, responds with 403 Forbidden status.
 * - If all security checks pass, responds with 200 OK status.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Response} - The response object indicating whether the request is allowed or blocked.
 */

export async function GET(req: Request) {
    // Set up Shield protection with multiple security layers
    // Shield combines bot detection, rate limiting, and other protections
    const decision = await aj.withRule(
        shield({
            mode: "LIVE", // Enforce all shield protection
        })
    )
    .withRule(
        fixedWindow({
            mode: "LIVE", // Enforce rate limiting
            max: 5, // Allow up to 5 requests per window
            window: 60, // Set the window to 60 seconds
        })
    )
    .protect(req);

    // Log detailed results from each security check
    for (const result of decision.results) {
        console.log("Rule Result", result);
    }

    // Log the final security decision
    console.log("Conclusion", decision.conclusion);

    // If any security check fails, block the request
    if(decision.isDenied()) {
        return NextResponse.json(
            {
                error: "[!] Request Blocked.",
                reason: decision.reason, // Contains details about why it was blocked
            },
            { status: 403 }
        );
    }

     // If all security checks pass, allow the request
    return NextResponse.json(
        {
            message: "[*] Request allowed and passed Security Checks.", // Security Check Passed Message.
        }
    );
}