import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://media.discordapp.net/attachments/1462227805197697094/1462477174660661381/image.png?ex=696e5581&is=696d0401&hm=765a934029e762c5736ac68ee7780e2423d932a1b4de75b58f496d5b0fb457cc&=&format=webp&quality=lossless&width=960&height=960')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="font-serif text-white text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight text-balance">
          Introducing
          <br />
          Skillify.
        </h1>

        <p className="mt-6 text-white/90 text-lg md:text-xl max-w-xl mx-auto">
          Revolutionizing lead generation for freelancers powered by AI
        </p>

        <div className="mt-8 flex justify-center">
          <Link href="http://localhost:8000/#/chat" >
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
