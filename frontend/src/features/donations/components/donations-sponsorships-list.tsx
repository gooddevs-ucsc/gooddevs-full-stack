import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, TrendingUp } from 'lucide-react';
import { DonationCard } from '@/features/donations/components/donation-card';
import { SponsorshipCard } from '@/features/donations/components/sponsorship-card';

const mockDonations = [
  {
    id: '1',
    donorName: 'John Doe',
    donorEmail: 'john@example.com',
    amount: 50000,
    currency: 'LKR',
    message: 'Keep up the great work supporting the community!',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'completed' as const,
    paymentMethod: 'Credit Card',
  },
  {
    id: '2',
    donorName: 'Anonymous',
    donorEmail: null,
    amount: 25000,
    currency: 'LKR',
    message: 'Supporting the developer community',
    createdAt: '2024-01-10T14:20:00Z',
    status: 'completed' as const,
    paymentMethod: 'PayPal',
  },
  {
    id: '3',
    donorName: 'Sarah Smith',
    donorEmail: 'sarah@email.com',
    amount: 10000,
    currency: 'LKR',
    message: null,
    createdAt: '2024-01-08T09:15:00Z',
    status: 'pending' as const,
    paymentMethod: 'Bank Transfer',
  },
];

const mockSponsorships = [
  {
    id: '1',
    sponsorName: 'Tech Corp Inc.',
    sponsorEmail: 'sponsor@techcorp.com',
    amount: 20000,
    currency: 'LKR',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-1',
    volunteerName: 'Jane Smith',
    duration: '3 months',
    createdAt: '2024-01-12T09:15:00Z',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const,
  },
  {
    id: '2',
    sponsorName: 'StartupXYZ',
    sponsorEmail: 'contact@startupxyz.com',
    amount: 15000,
    currency: 'LKR',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-2',
    volunteerName: 'Mike Johnson',
    duration: '6 months',
    createdAt: '2024-01-08T16:30:00Z',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const,
  },
];

export const DonationsSponsorshipsList = () => {
  const [activeView, setActiveView] = useState<'donations' | 'sponsorships'>(
    'donations',
  );

  const totalDonations = mockDonations.reduce(
    (sum, donation) => sum + donation.amount,
    0,
  );
  const totalSponsorships = mockSponsorships.reduce(
    (sum, sponsorship) => sum + sponsorship.amount,
    0,
  );
  const activeSponsorships = mockSponsorships.filter(
    (s) => s.status === 'active',
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rs.{totalDonations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockDonations.length} donations received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sponsorships
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              Rs.{totalSponsorships.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeSponsorships} active sponsors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              Rs.{(totalDonations + totalSponsorships).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Combined income</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-2 rounded-lg bg-muted p-1">
        <Button
          variant={activeView === 'donations' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setActiveView('donations')}
        >
          Donations ({mockDonations.length})
        </Button>
        <Button
          variant={activeView === 'sponsorships' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setActiveView('sponsorships')}
        >
          Sponsorships ({mockSponsorships.length})
        </Button>
      </div>

      {activeView === 'donations' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockDonations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockSponsorships.map((sponsorship) => (
            <SponsorshipCard key={sponsorship.id} sponsorship={sponsorship} />
          ))}
        </div>
      )}
    </div>
  );
};
