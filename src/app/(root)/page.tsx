import { Footer } from "@/components/footer";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Video } from "@/components/video";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative items-center justify-center min-h-screen pt-2">
      {/* Header Section */}
      <section className="relative isolate overflow-hidden bg-white dark:bg-black py-24 px-4">
        {/* Grain overlay */}
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[3%] dark:opacity-[5%]" />

        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 bg-[repeating-linear-gradient(90deg,_transparent_0px,_transparent_24px,_rgba(0,0,0,0.03)_24px,_rgba(0,0,0,0.03)_25px)] dark:bg-[repeating-linear-gradient(90deg,_transparent_0px,_transparent_24px,_rgba(255,255,255,0.03)_24px,_rgba(255,255,255,0.03)_25px)]" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-black dark:from-white to-gray-500 dark:to-gray-400">
                ExamFlow
              </span>
              <br />
              <span className="text-gray-900 dark:text-gray-100">
                Streamline Your Exam Management
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
              Effortlessly manage exam scheduling, seating arrangements, and
              student performance tracking. Designed for educational
              institutions to handle exams with precision and ease.
            </p>

            <Button asChild className="-mt-8">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="text-center py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-6xl font-bold text-gray-700 dark:text-gray-200 mb-10">
            How to Use
          </h2>
          <div className="max-w-4xl mx-auto">
            <Video />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative flex flex-col items-center justify-center text-center mt-11 py-16 px-4">
        <h2 className="text-3xl sm:text-6xl font-bold text-gray-700 dark:text-gray-200 mb-8">
          What our users say about us
        </h2>
        <div className="relative w-full z-10">
          <Testimonials />
        </div>
      </section>

      {/* Footer Section */}
      <section className="pt-3">
        <Footer />
      </section>
    </main>
  );
}
