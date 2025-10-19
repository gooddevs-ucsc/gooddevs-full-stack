import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';
import { InitiateDonation } from '@/features/donations';

const DonationRoute = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <>
      <Head
        title="Make a Donation - GoodDevs"
        description="Support our platform and help us continue our mission to connect developers with meaningful projects"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-2xl py-12">
          <div className="mb-6">
            <Button variant="outline" onClick={handleBackClick}>
              <div className="flex items-center">
                <ArrowLeft className="mr-2 size-4" />
                Back
              </div>
            </Button>
          </div>
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Make a Donation</h1>
            <p className="mt-3 text-lg text-gray-600">
              Support our platform and help us continue our mission to connect
              developers with meaningful projects
            </p>
          </div>
          <InitiateDonation />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DonationRoute;
