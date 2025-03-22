import { aj } from "@/lib/arcjet";
import { sensitiveInfo } from "@arcjet/next";
import { NextResponse } from "next/server";

/**
 * Sensitive Information Detection API Route
 *
 * This route demonstrates Arcjet's capability to detect and block sensitive information in requests.
 * It helps prevent the exposure of sensitive data such as phone numbers, email addresses, credit card numbers, and IP addresses.
 *
 * The route shows how to:
 * 1. Set up sensitive information detection rules
 * 2. Handle requests that contain sensitive information
 * 3. Allow legitimate requests that do not contain sensitive information
 *
 --------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * POST /api/arcjet/sensitive-info
 * 
 * This route handles POST requests and uses Arcjet to detect sensitive information.
 * 
 * - Initializes sensitive information detection with specified rules.
 * - Uses "LIVE" mode to actively block requests containing sensitive information.
 * - If sensitive information is detected, responds with 403 Forbidden status.
 * - If no sensitive information is detected, responds with 200 OK status.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Response} - The response object indicating whether sensitive information was detected or not.
 */

export async function POST(req: Request) {
    // Set up sensitive information detection with specified rules
    const decision = await aj.withRule(
        sensitiveInfo({
            mode: "LIVE",
            deny: ["PHONE_NUMBER", "EMAIL", "CREDIT_CARD_NUMBER", "IP_ADDRESS"], // Deny these types of sensitive information
        })
    )
    .protect(req);

    // If sensitive information is detected, return a 403 Forbidden response
    if (decision.isDenied()) {
        return NextResponse.json(
            {
                error: "[!] Sensitive Information Detected.",
                reason: decision.reason, // Added reason for sensitive information detection
            },
            { status: 403 }
        );
    }

    // Otherwise, continue with the request
    return NextResponse.json({
        message: "[+] Sensitive Information Not Detected."
    });
}