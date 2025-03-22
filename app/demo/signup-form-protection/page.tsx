"use client";
import { useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupProtectionDemo() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ message?: string; error?: string; reason?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestCount, setRequestCount] = useState(0);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email.trim()) {
      setError("Enter an email address.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/arcjet/signup-form-protection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult(data);
      setRequestCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error during signup:", error);
      setResult({ error: "Failed to process signup." });
    }

    setLoading(false);
  };

  const rapidTest = async () => {
    setLoading(true);
    const results = [];
    for (let i = 0; i < 6; i++) {
      try {
        const res = await fetch("/api/arcjet/signup-form-protection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        results.push(data);
        setRequestCount((prev) => prev + 1);
      } catch (error) {
        results.push({ error: "Request failed" });
      }
    }
    setResult(results[results.length - 1]);
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
        <UserPlus className="mr-2 size-8" /> Signup Protection Demo
      </h1>
      <div className="mb-8 p-4 bg-zinc-900 rounded border border-zinc-700">
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
          Enter Email Address:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-2 p-2 block w-full bg-zinc-800 border ${
            error ? "border-red-500" : "border-zinc-700"
          } rounded text-gray-300`}
          placeholder="example@example.com"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSignup}
            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
          <button
            onClick={rapidTest}
            className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500"
            disabled={loading}
          >
            Test Rate Limit
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Request count: {requestCount} (Rate limit: 5 per 10 seconds)
        </p>
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
          <li>Combines multiple security layers including email validation, bot detection, and rate limiting.</li>
          <li>Blocks invalid, temporary, disposable, and emails without MX records.</li>
          <li>Detects and blocks known bot signatures.</li>
          <li>Applies rate limiting to prevent abuse.</li>
          <li>Allows legitimate signup requests that pass all security checks.</li>
        </ul>
      </div>

      {/* Email Examples Section */}
      <div className="mt-8 p-4 bg-zinc-900 rounded border border-zinc-700">
        <h2 className="text-lg font-semibold mb-1">Test Emails</h2>
        <p className="text-sm text-gray-400">Try these emails to see how the validation works:</p>
        <ul className="mt-2 space-y-2 list-disc pl-5 text-sm">
          <li>
            <span className="font-medium text-green-500">user123@gmail.com</span> – Valid email format.
          </li>
          <li>
            <span className="font-medium text-yellow-500">invalid.@arcjet</span> – Invalid email format.
          </li>
          <li>
            <span className="font-medium text-red-500">test@0zc7eznv3rsiswlohu.tk</span> – Disposable email provider.
          </li>
          <li>
            <span className="font-medium text-gray-400">nonexistent@arcjet.ai</span> – No MX records.
          </li>
        </ul>
      </div>
    </div>
  );
}