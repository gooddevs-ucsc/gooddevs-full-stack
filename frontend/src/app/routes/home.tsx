import { Head } from '@/components/seo';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';
import { TestimonialsSection } from '@/features/about/components';
import { AboutSection, HeroSection } from '@/features/home/components';

const HomeRoute = () => {
  return (
    <>
      <Head description="Discover amazing projects looking for skilled developers" />
      <div className="min-h-screen bg-white">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </>
  );
};

export default HomeRoute;
