import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#1e40af]">
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="font-serif text-white text-6xl md:text-7xl lg:text-8xl tracking-tight italic mb-8">
          Skillify
        </h1>

        <p className="text-white text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight text-balance">
          One platform to <em className="font-serif">seamlessly</em> manage
          <br />
          and scale creative operations
        </p>

        <p className="mt-6 text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
          <em className="font-serif">Revolutionizing</em> lead generation for freelancers powered by <em className="font-serif">AI</em>
        </p>

        <div className="mt-8 flex justify-center">
          <Link href="http://localhost:8000/#/chat">
            <Button
              variant="outline"
              className="rounded-full border-white/40 text-white hover:bg-white/10 hover:text-white px-6 py-6 text-sm font-medium bg-transparent"
            >
              Watch Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
