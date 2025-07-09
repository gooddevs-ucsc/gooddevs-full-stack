import { Handshake, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCard from './StatsCard';
import ProjectCard from './ProjectCard';
import SponsorshipCard from './SponsorshipCard';

export default function DashboardContent() {
  const projects = [
    {
      title: "Environmental Tracker",
      description: "Modern online store with payment integration"
    },
    {
      title: "Environmental Tracker",
      description: "Modern online store with payment integration"
    },
    {
      title: "Environmental Tracker",
      description: "Modern online store with payment integration"
    },
    {
      title: "Environmental Tracker",
      description: "Modern online store with payment integration"
    },
    {
      title: "Environmental Tracker",
      description: "Modern online store with payment integration"
    },
    {
      title: "Environmental Tracker",
      description: "Modern online store with payment integration"
    }
  ];

  const sponsorships = [
    {
      title: "Environmental Tracker",
      amount: "Rs. 50,000"
    },
    {
      title: "Environmental Tracker",
      amount: "Rs. 50,000"
    }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, Hemal!</h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="My Sponsorships"
            value="2"
            icon={<Handshake className="h-6 w-6 text-orange-600" />}
            iconBg="bg-orange-100"
          />
          <StatsCard
            title="My donations"
            value="4"
            icon={<Heart className="h-6 w-6 text-red-600" />}
            iconBg="bg-red-100"
          />
        </div>
        
        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                onViewMore={() => console.log(`View more for ${project.title}`)}
              />
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button 
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              See All
            </Button>
          </div>
        </div>
        
        {/* My Sponsorships Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Sponsorships</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsorships.map((sponsorship, index) => (
              <SponsorshipCard
                key={index}
                title={sponsorship.title}
                amount={sponsorship.amount}
                onViewMore={() => console.log(`View more for ${sponsorship.title}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}