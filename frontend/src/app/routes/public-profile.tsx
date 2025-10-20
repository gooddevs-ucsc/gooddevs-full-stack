import { PublicProfile } from '@/components/profile/public-profile';
import { Head } from '@/components/seo';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';

const PublicProfileRoute = () => {
  return (
    <>
      <Head title="Public Profile" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <PublicProfile />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PublicProfileRoute;
