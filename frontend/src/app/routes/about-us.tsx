import { FC } from 'react';

import { Head } from '@/components/seo';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';
import {
  HeroSection,
  RoadmapSection,
  ServicesSection,
  StatsSection,
  TestimonialsSection,
  ValuesSection,
  VisionMissionSection,
} from '@/features/about/components';

const AboutUsRoute: FC = () => {
  return (
    <>
      <Head title="About Us - GoodDevs" />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <StatsSection />
          <VisionMissionSection />
          <ServicesSection />
          <ValuesSection />
          <RoadmapSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutUsRoute;
