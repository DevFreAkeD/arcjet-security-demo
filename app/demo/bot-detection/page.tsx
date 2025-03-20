"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, CopyIcon, ArrowLeft } from "lucide-react";

export default function BotDetectionDemo() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const testBotDetection = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/arcjet/bot-detection");
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Request failed" });
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    const command = `curl -v http://localhost:3000/api/arcjet/bot-detection`;
    navigator.clipboard.writeText(command)
      .then(() => {
        console.log("Copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        console.log("Failed to copy!");
      });
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

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Bot className="mr-2 pb-1 size-10" /> Bot Detection Demo
        </h1>

        <p className="mb-6 text-gray-100">
            This demo shows how Arcjet detects and blocks automated clients like
            curl while allowing legitimate browser traffic.
        </p>

        <div className="mb-8 p-4 bg-zinc-900 rounded border border-zinc-700">
            <h2 className="text-lg font-semibold mb-2">Two Ways to Test</h2>

            <div className="mb-6">
                <h3 className="font-bold text-green-700 mb-2">
                    1. Browser Request (Allowed)
                </h3>
                <p className="mb-4 text-gray-300">
                    Click the button below to make a request from your browser (should
                    be allowed as its a genuine client browser request):
                </p>
                <button
                    onClick={testBotDetection}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? "Testing..." : "Send Test Request"}
                </button>
            </div>

            <div className="mt-8">
                <h3 className="font-bold text-red-700 mb-2">
                    2. Curl Request (Blocked)
                </h3>
                <p className="mb-4 text-gray-300">
                    Try this command in your terminal - it will be blocked.<br />Click below to copy the cURL command to your clipboard.
                </p>
                <div 
                    onClick={copyToClipboard} 
                    className="relative cursor-pointer bg-zinc-700 text-white p-4 rounded overflow-x-auto select-none group"
                >
                    <pre>curl -v http://localhost:3000/api/arcjet/bot-detection</pre>
                    {/* Copy Icon */}
                    <span className="absolute top-4 right-2 text-white text-sm">
                        <CopyIcon />
                    </span>
                </div>
                <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
                    <p className="font-bold text-yellow-800">Important:</p>
                    <p className="text-yellow-700">
                        When your request is blocked, your IP address will be temporarily
                        banned for 60 seconds. During this time, all requests from your IP
                        will be automatically rejected. This helps prevent automated
                        attacks while allowing legitimate users to retry after a short
                        wait.
                    </p>
                </div>
            </div>
        </div>

        {result && (
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Result:</h2>
                <div
                    className={`p-4 rounded ${
                        result.error ? "bg-zinc-900 border border-red-500 text-red-500" : "bg-zinc-900 border border-green-500 text-green-500"
                    }`}
                >
                    <pre className="overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            </div>
        )}

        <div className="mt-8 p-4 bg-zinc-900 rounded border border-zinc-700">
            <h2 className="text-lg font-semibold mb-2">How It Works</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                <li>Browser requests are allowed through because they have legitimate User-Agents and characteristics</li>
                <li>Curl requests are automatically detected as automated tools and blocked</li>
                <li>When blocked, the client's IP is temporarily blocked for 60 seconds</li>
                <li>This protection helps prevent automated scraping and abuse of your API</li>
            </ul>
        </div>
    </div>
  );
}