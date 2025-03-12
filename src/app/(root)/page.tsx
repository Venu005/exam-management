import { DemoCircles } from "@/components/circles";
import { Footer } from "@/components/footer";
import { Testimonials } from "@/components/Testimonials";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative  items-center justify-center min-h-screen pt-2">
      <section>
        <DemoCircles />
      </section>
      <section>
        <div className="">
          <h1 className="text-2xl">How to use</h1>
          <p>add a viedo later</p>
        </div>
      </section>
      <section className="relative flex flex-col items-center justify-center text-center">
        <h1 className=" text-3xl  sm:text-6xl font-bold text-gray-700">
          What our users say about us
        </h1>
        <div>
          <Testimonials /> 
        </div>
      </section>
      <section className="pt-3">
        <Footer />
      </section>
    </main>
  );
}
