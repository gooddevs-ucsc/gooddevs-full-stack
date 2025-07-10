import { Head } from '@/components/seo';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';
import { AboutSection, HeroSection } from '@/features/home/components';

const HomeRoute = () => {
  return (
    <>
      <Head description="Discover amazing projects looking for skilled developers" />
      <div className="min-h-screen bg-white">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <Footer />
      </div>
    </>
  );
};

export default HomeRoute;
