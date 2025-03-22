import { demos } from "@/data";
import { Card } from "@/components/Card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen text-gray-100 overflow-hidden">
      {/* Rotating Background Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/arcjet-space-obj-v2-5-dark.C1beHbai.png"
          alt="Arcjet Security"
          width={700}
          height={700}
          className="opacity-10 animate-spin-slow"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 sm:py-16 sm:px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Arcjet Security - Demo
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-300">
            Explore different security features provided by Arcjet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-5">
          {demos.map((demo) => (
            <Card key={demo.title} {...demo} />
          ))}
        </div>
      </div>
    </main>
  );
}
