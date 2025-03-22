"use client";
import { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SensitiveInfoDemo() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<{ message?: string; error?: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleCheck = async () => {
        if (!input.trim()) {
            setError("Enter some text to check.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch("/api/arcjet/sensitive-info", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ input }),
            });

            const data = await response.json();
            setResult(data);
            } catch (error) {
                console.error("Error during check:", error);
                setResult({ error: "Failed to process check." });
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
                <Lock className="mr-2 size-8" /> Sensitive Information Detection Demo
            </h1>
            <div className="mb-8 p-4 bg-zinc-900 rounded border border-zinc-700">
                <label htmlFor="input" className="mb-2 block text-sm font-medium text-gray-300">
                    Enter Text to Check:
                </label>
                <textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`mt-2 p-2 block w-full bg-zinc-800 border ${
                        error ? "border-red-500" : "border-zinc-700"
                    } rounded text-gray-300`}
                    placeholder="Enter text containing sensitive information..."
                    rows={4}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <button
                    onClick={handleCheck}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Check Text"}
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
                    <li>Detects and blocks sensitive information such as phone numbers, email addresses, credit card numbers, and IP addresses.</li>
                    <li>Uses Arcjet's sensitive information detection rules to analyze the input text.</li>
                    <li>Blocks requests containing sensitive information and allows legitimate requests.</li>
                </ul>
            </div>

            {/* Example Inputs Section */}
            <div className="mt-8 p-4 bg-zinc-900 rounded border border-zinc-700">
                <h2 className="text-lg font-semibold mb-1">Example Inputs</h2>
                <p className="text-sm text-gray-400">Try these inputs to see how the detection works:</p>
                <ul className="mt-2 space-y-2 list-disc pl-5 text-sm">
                    <li>
                        <span className="font-medium text-yellow-500">+91 9412xxxxx2</span> – Phone number.
                    </li>
                    <li>
                        <span className="font-medium text-red-500">test@example.com</span> – Email address.
                    </li>
                    <li>
                        <span className="font-medium text-gray-400">4111 1111 1111 1111</span> – Credit card number.
                    </li>
                    <li>
                        <span className="font-medium text-gray-400">192.168.0.1</span> – IP address.
                    </li>
                </ul>
            </div>
        </div>
    );
}