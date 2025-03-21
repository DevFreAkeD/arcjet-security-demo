import { aj } from "@/lib/arcjet";
import { detectBot, validateEmail } from "@arcjet/next";
import { NextResponse } from "next/server";

/**
 * Email Validation API Route
 *
 * This route demonstrates Arcjet's email validation capabilities.
 * It helps identify and block invalid or disposable email addresses.
 *
 * Email validation checks for:
 * - Disposable email addresses
 * - Free email providers
 * - Missing MX records
 * - No Gravatar associated with the email
 * - Invalid email format
 *
 * The route shows how to:
 * 1. Set up email validation rules
 * 2. Handle requests with invalid emails
 * 3. Allow legitimate email addresses
 *
 * GET /api/arcjet/email-validation
 * 
 * This route handles GET requests and uses Arcjet to validate email addresses.
 * 
 * - Initializes email validation with specified rules.
 * - Uses "LIVE" mode to actively block invalid email addresses.
 * - If an invalid email is detected, responds with 400 Bad Request status.
 * - If the email is valid, responds with 200 OK status.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Response} - The response object indicating whether the email is valid or not.
 */

export async function GET(req: Request) {
    const { email } = await req.json();

    // Initialize email validation with specified rules
    const decision = await aj.withRule(
        validateEmail({
            mode: "LIVE", // "LIVE" will block invalid emails and "DRY_RUN" to log only.
            deny: ["DISPOSABLE", "FREE", "NO_MX_RECORDS", "NO_GRAVATAR", "INVALID"], // Deny specific types of invalid emails
        })
    )
    .withRule(
        detectBot({
            mode: "LIVE", // "LIVE" will block invalid emails and "DRY_RUN" to log only.
            allow: [], // "allow none" will block all detected bots
        })
    )
    .protect(req, {
        email,
    });

    // If the email is invalid, return 400 Bad Request
    if(decision.isDenied()) {
        return NextResponse.json(
            {
              error: "[!] Invalid Email Address.",
              reason: decision.reason, // Contains details about why it was flagged as invalid
            },
            { status: 400 }
        );
    }

    // If the email is valid, allow it
    return NextResponse.json(
        {
            message: "[+] Valid Email Address.",
            reason: decision.reason, // Contains details about the decision
        },
        {status: 200}
    );
}