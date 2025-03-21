"use client";
import { ArrowLeft, Gauge } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface RequestResult {
  timestamp: string;
  duration: number;
  status: number;
  data?: {
    message: string;
    remainingTokens?: number;
    resetTime?: string;
    country?: string;
  };
  error?: string;
}

export default function RateLimitDemo() {
  const [requests, setRequests] = useState<RequestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<number>(20); // Start with max tokens for logged in
  const [resetTime, setResetTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // TODO: Replace with actual user login logic

  const router = useRouter();

  const maxTokens = isLoggedIn ? 20 : 5; // Different capacities based on login state
  const refillRate = isLoggedIn ? 10 : 3; // Different refill rates

  useEffect(() => {
    // Reset tokens when login state changes
    setTokens(maxTokens);
    setResetTime(null);
    setTimeLeft("");
  }, [isLoggedIn, maxTokens]);

  useEffect(() => {
    if (tokens < maxTokens && resetTime) {
      const countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = resetTime.getTime() - now.getTime();

        if (diff <= 0) {
          // Time to refill tokens
          setTokens((prev) => Math.min(prev + refillRate, maxTokens));
          if (tokens + refillRate < maxTokens) {
            setResetTime(new Date(now.getTime() + 10000));
          } else {
            setResetTime(null);
            setTimeLeft("");
          }
        } else {
          const seconds = Math.ceil(diff / 1000);
          setTimeLeft(`${seconds}s`);
        }
      }, 100);

      return () => clearInterval(countdownInterval);
    }
  }, [tokens, resetTime, maxTokens, refillRate]);

  const makeRequest = async () => {
    setLoading(true);
    try {
      const startTime = Date.now();
      const res = await fetch("/api/arcjet/rate-limit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isLoggedIn }),
      });
      const data = await res.json();
      const endTime = Date.now();

      const result = {
        timestamp: new Date().toISOString(),
        duration: endTime - startTime,
        status: res.status,
        data,
      };

      if (data.remainingTokens !== undefined) {
        setTokens(data.remainingTokens);
        if (data.remainingTokens < maxTokens && data.resetTime) {
          setResetTime(new Date(data.resetTime));
        } else {
          setResetTime(null);
          setTimeLeft("");
        }
      }

      setRequests((prev) => [result, ...prev]);
    } catch (error) {
      const result = {
        timestamp: new Date().toISOString(),
        status: 500,
        error: "Request failed",
        duration: 0,
      };
      setRequests((prev) => [result, ...prev]);
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

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Gauge className="mr-2 pb-1 size-10" /> Bot Detection Demo
        </h1>
      <p className="mb-6 text-gray-100">
        Test Arcjet's rate limiting capabilities with different rules for
        logged-in and anonymous users.
      </p>

      <div className="bg-zinc-900 p-4 rounded shadow-sm border border-zinc-700 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isLoggedIn
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {isLoggedIn ? "Logged In" : "Anonymous"}
            </button>
            <span className="text-sm text-gray-300">
              Click to toggle user state
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {isLoggedIn
              ? "Capacity: 20 tokens, Refill: 10 per 10s"
              : "Capacity: 5 tokens, Refill: 3 per 10s"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={makeRequest}
          disabled={loading}
          className={`px-6 py-3 rounded font-medium transition-colors ${
            loading
              ? "bg-zinc-400 cursor-not-allowed text-gray-800"
              : "bg-blue-800 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Making Request..." : "Make Request"}
        </button>

        <div className="flex items-center gap-4 text-sm">
          <div className="bg-zinc-700 border border-zinc-400 px-4 py-2 rounded">
            <span className="font-medium">Tokens: </span>
            <span
              className={tokens === 0 ? "text-red-500" : "text-green-500"}
              title={`Maximum: ${maxTokens}`}
            >
              {tokens}/{maxTokens}
            </span>
          </div>

          {timeLeft && (
            <div className="bg-zinc-700 border border-zinc-400 px-4 py-2 rounded-lg">
              <span className="font-medium">Refill in: </span>
              <span className="text-blue-500">{timeLeft}</span>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8">Request History</h2>
      <div className="mt-3 pr-2 overflow-y-auto max-h-[460px]">
        {requests.length === 0 ? (
          <p className="text-gray-400">No Request History Available</p>
        ) : (
          <div className="space-y-2">
            {requests.map((req, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  req.status === 429
                    ? "bg-zinc-900 border border-red-500 text-red-500"
                    : req.status === 200
                    ? "bg-zinc-900 border border-green-500 text-green-500"
                    : "bg-zinc-900 border border-yellow-500 text-yellow-500"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">
                    Status: {req.status} 👋{" "}
                    {req.data?.country || "Unknown Location"}
                  </span>
                  <span className="text-gray-400">
                    Duration: {req.duration}ms
                  </span>
                </div>
                <div className={`text-sm ${
                  req.status === 429
                    ? "text-red-500"
                    : req.status === 200
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}>
                  {req.data ? JSON.stringify(req.data) : req.error}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-zinc-900 rounded border border-zinc-700">
        <h2 className="text-lg font-semibold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Logged In Users</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
              <li>Token bucket starts with 20 tokens</li>
              <li>Tokens refill at 10 per 10 seconds</li>
              <li>Each request consumes 5 tokens</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Anonymous Users</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
              <li>Token bucket starts with 5 tokens</li>
              <li>Tokens refill at 3 per 10 seconds</li>
              <li>Each request consumes 5 tokens</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}