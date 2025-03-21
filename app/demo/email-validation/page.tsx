"use client";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmailValidationDemo() {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState<{ message?: string; error?: string; reason?: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleValidateEmail = async () => {
        if (!email.trim()) {
            setError("Enter an email address.");
            return;
        }
        
        setLoading(true);
        setError("");
        setResult(null);
        
        try {
            const response = await fetch("/api/arcjet/email-validation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error validating email:", error);
            setResult({ error: "Failed to validate email." });
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
                <Mail className="mr-2 size-8" /> Email Validation Demo
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

                <button
                    onClick={handleValidateEmail}
                    className="mt-3 px-5 w-[200px] py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
                >
                    {loading ? "Validating..." : "Validate Email"}
                </button>
            </div>

            {result && (
                <div className="mt-8">
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
                    <li>Disposable email addresses are blocked.</li>
                    <li>Free email providers are blocked.</li>
                    <li>Emails without MX records are blocked.</li>
                    <li>Emails without a Gravatar are blocked.</li>
                    <li>Invalid email formats are blocked.</li>
                </ul>
            </div>

            {/* Email Examples Section */}
            <div className="mt-8 p-4 bg-zinc-900 rounded border border-zinc-700">
                <h2 className="text-lg font-semibold mb-1">Test Emails</h2>
                <p className="text-sm text-gray-400">Try these emails to see how the validation works:</p>
                <ul className="mt-2 space-y-2 list-disc pl-5 text-sm">
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