import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Content from "@/components/Content";
import TestimonialsMain from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-graph-wall">
      <Navbar />
      <Hero />
      <Content />
      <About />
      <TestimonialsMain />
      <Footer />
    </main>
  );
}
