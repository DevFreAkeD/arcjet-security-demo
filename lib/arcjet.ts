import arcjet from "@arcjet/next";

export const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    characteristics: [ "ip.src" ], // Track client IP address and refer to https://docs.arcjet.com/architecture#built-in-characteristics for list of characteristics
    rules: [],
});
