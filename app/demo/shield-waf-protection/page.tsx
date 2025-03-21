"use client";
import { useState } from "react";
import { ArrowLeft, CopyIcon, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const copyToClipboard = () => {
    const command = `curl -v -H "x-arcjet-suspicious: true "http://localhost:3000/api/arcjet/shield-bot-protection`;
    navigator.clipboard.writeText(command)
      .then(() => {
        console.log("Copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        console.log("Failed to copy!");
      });
};

export default function ShieldWAFProtectionDemo() {
    const [result, setResult] = useState<{ message?: string; error?: string; reason?: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleTestProtection = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/arcjet/shield-waf-protection", {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error testing protection:", error);
            setResult({ error: "Failed to test protection." });
        }
        setLoading(false);
    };

  return (
        <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Back Button */}
        <button 
            onClick={() => router.push("/")}
            className="flex items-center text-blue-500 hover:underline hover:cursor-pointer mb-4"
        >
            <ArrowLeft className="w-5 h-5 mr-2" />
                Back
        </button>

        <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Shield className="mr-2 size-8" /> Shield WAF Protection Demo
        </h1>
        <p className="mb-6 text-gray-600">
            Test Arcjet's Shield WAF protection by simulating requests from suspicious IPs. Run the following curl command in your terminal to test the protection:
        </p>

        <div className="bg-zinc-900 rounded border border-zinc-700 p-4 mb-8">
            <h3 className="font-bold text-blue-700 mb-2">Suspicious IP Test</h3>
            <p className="text-sm text-zinc-300 mb-4">
                This command simulates a request from a suspicious IP address. The header "x-arcjet-suspicious: true" triggers Arcjet's Shield protection.
            </p>
            <div 
                onClick={copyToClipboard} 
                className="relative cursor-pointer bg-zinc-700 text-white p-4 rounded overflow-x-auto select-none group"
            >
                <pre className="text-[15px]">curl -v -H "x-arcjet-suspicious: true "http://localhost:3000/api/arcjet/shield-bot-protection</pre>
                    {/* Copy Icon */}
                    <span className="absolute top-4 right-2 text-white text-sm">
                        <CopyIcon />
                    </span>
            </div>
        </div>

        <div className="mt-4 bg-blue-100 border-l-4 border-blue-500 p-4 mb-4">
            <h3 className="font-bold text-blue-700 mb-2">Expected Behavior</h3>
            <p className="text-sm text-blue-600">
                When you run this command, Arcjet's Shield protection should detect the suspicious IP and block the request. You should see a response indicating that the request was blocked for security reasons.
            </p>
        </div>

        <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
            <h3 className="font-bold text-yellow-800 mb-2">Rate Limiting</h3>
                <p className="text-sm text-yellow-700">
                    In addition to Shield protection, requests are rate limited using a fixed window. Each IP address is limited to 5 successful requests per 60 second window. If you exceed this limit, subsequent requests will be blocked until the window resets. This helps prevent abuse while allowing legitimate usage.
                </p>
        </div>

        <div className="mb-8 p-4 bg-zinc-900 rounded border border-zinc-700">
            <button
                onClick={handleTestProtection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? "Testing..." : "Test Protection"}
            </button>
        </div>

        {result && (
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Result:</h2>
                <div
                    className={`p-4 rounded ${
                        result.error ? "bg-zinc-900 border border-red-500 text-red-500" : "bg-zinc-900 border border-green-500 text-green-500"
                    }`}
                >
                    <pre className="overflow-auto">{JSON.stringify(result, null, 2)}</pre>
                </div>
            </div>
        )}

        <div className="mt-8 p-4 bg-zinc-900 rounded border border-zinc-700">
            <h2 className="text-lg font-semibold mb-2">How It Works</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                <li>Combines multiple security layers including bot detection and rate limiting.</li>
                <li>Blocks requests that fail any security check.</li>
                <li>Logs detailed results from each security check.</li>
                <li>Allows requests that pass all security checks.</li>
            </ul>
        </div>
    </div>
  );
}