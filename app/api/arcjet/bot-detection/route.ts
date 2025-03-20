import { aj } from "@/lib/arcjet";
import { detectBot } from "@arcjet/next";
import { NextResponse } from "next/server";

/**
 * Bot Detection API Route
 *
 * This route demonstrates Arcjet's bot detection capabilities.
 * It helps identify and block automated traffic to your API.
 *
 * Bot detection looks for signs that a request might be automated:
 * - Suspicious patterns in request timing
 * - Unusual browser fingerprints
 * - Known bot signatures
 * - Machine-like behavior patterns
 *
 * Think of it as a smart security system that can tell the difference
 * between real users and automated programs trying to access your API.
 *
 * The route shows how to:
 * 1. Set up bot detection rules
 * 2. Handle requests identified as bots
 * 3. Allow legitimate automated traffic (like good bots)
 *
 ---------------------------------------------------------------------------------------------------------------
 *
 * GET /api/arcjet/bot-detection
 * 
 * This route handles GET requests and uses Arcjet to detect and block bot traffic.
 * 
 * - Initializes bot detection with specified rules.
 * - Uses "LIVE" mode to actively block requests identified as bot traffic.
 * - No bots are explicitly allowed (empty allow array).
 * - If bot traffic is detected, responds with 403 Forbidden status.
 * - If traffic is identified as human, responds with 200 OK status.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Response} - The response object indicating whether the traffic is allowed or denied.
 */

export async function GET(req: Request) {
    // Initialize bot detection with specified rules
    // The empty allow array means no bots are explicitly allowed
    const decision = await aj.withRule(
        detectBot({
            mode: "LIVE", // "LIVE" will block requests and "DRY_RUN" to log only.
            allow: [], // No bots are whitelisted or check botlist at https://arcjet.com/bot-list
        })
    )
    .protect(req);

    // If bot traffic is detected, return 403 Forbidden
    if(decision.isDenied()) {
        return NextResponse.json(
            {
              error: "[!] Bot Traffic Detected.",
              reason: decision.reason, // Contains details about why it was flagged as a bot
            },
            { status: 403 }
        );
    }

    // If traffic appears to be from a human, allow it
    return NextResponse.json(
        {
            message: "[+] Human Traffic Allowed.",
            reason: decision.reason, // Contains details about the decision
        },
        {status: 200}
    );
}