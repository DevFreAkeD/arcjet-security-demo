import { aj } from "@/lib/arcjet";
import { protectSignup } from "@arcjet/next";
import { NextResponse } from "next/server";

/**
 * Signup Form Protection API Route
 *
 * This route demonstrates Arcjet's signup protection capabilities.
 * It combines multiple security layers including email validation, bot detection,
 * and rate limiting to secure the signup process.
 *
 * Signup protection checks for:
 * - Invalid, temporary, disposable, and emails without MX records
 * - Known bot signatures
 * - Rate limiting to prevent abuse
 *
 * The route shows how to:
 * 1. Set up signup protection rules
 * 2. Handle requests that fail security checks
 * 3. Allow legitimate signup requests that pass all security checks
 *
 ---------------------------------------------------------------------------------------------------------------
 *
 *  POST /api/arcjet/signup-from-protection
 * 
 * This route handles POST requests and uses Arcjet to apply signup protection.
 * 
 * - Extracts email from the request body for validation.
 * - Initializes signup protection with specified rules.
 * - Uses "LIVE" mode to actively block invalid emails, bots, and rate limit abuse.
 * - If any security check fails, responds with 403 Forbidden status.
 * - If all security checks pass, responds with 200 OK status.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Response} - The response object indicating whether the signup request is allowed or blocked.
 */

export async function POST(req: Request) {
    // Extract email from request body for validation
    const { email } = await req.json();

    // Set up signup protection with multiple security layers
    const decision = await aj.withRule(
        protectSignup({
            email: {
                mode: "LIVE",
                block: ["INVALID", "INVALID", "DISPOSABLE", "NO_MX_RECORDS"], // Block invalid, temporary, disposable, and no MX records emails
            },
            bots: {
                mode: "LIVE",
                allow: [], // No Bots are allowed
            },
            rateLimit: {
                mode: "LIVE",
                max: 5, // Max 5 requests per minute
                interval: "10s", // Interval of 10 seconds
            },
        })
    )
    .protect(req, {
        email, // Pass email for validation
    });

    // If the request is blocked, return 403 Forbidden
    if(decision.isDenied()) {
        return NextResponse.json(
            {
                error: "[!] Signup Blocked.",
                reason: decision.reason, // Contains details about why it was blocked
            },
            { status: 403 }
        );
    }

    // If the request is allowed, return 200 OK
    return NextResponse.json(
        {
            message: "[+] Signup Allowed.",
        },
        { status: 200 }
    );
}