import { Head } from '@/components/seo';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';
import { InitiateDonation } from '@/features/donations';

const DonationRoute = () => {
  return (
    <>
      <Head
        title="Make a Donation - GoodDevs"
        description="Support our platform and help us continue our mission to connect developers with meaningful projects"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-2xl py-12">
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
