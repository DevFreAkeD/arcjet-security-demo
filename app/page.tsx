import { demos } from "@/data"
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto py-16 px-4 sm:py-24 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-100 sm:text-5xl md:text-6xl">
            Arcjet Security - Demo
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-300">
            Explore different security features provided by Arcjet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {demos.map((demo) => (
            <Card key={demo.title} {...demo} />
          ))}
        </div>
      </div>
    </main>
  );
}