import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, TrendingUp, Plus, ArrowLeft } from 'lucide-react';
import { DonationCard } from '@/features/donations/components/donation-card';
import { SponsorshipCard } from '@/features/donations/components/sponsorship-card';
import { DonationForm } from './donation-form';
import { SponsorshipForm } from './sponsorship-form';

// Mock data for current sponsor (filtered by sponsor email)
const mockSponsorDonations = [
  {
    id: '1',
    donorName: 'Current Sponsor',
    donorEmail: 'sponsor@example.com',
    amount: 500,
    currency: 'USD',
    message: 'Supporting the developer community',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'completed' as const,
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    donorName: 'Current Sponsor',
    donorEmail: 'sponsor@example.com',
    amount: 250,
    currency: 'USD',
    message: 'Keep up the great work!',
    createdAt: '2024-01-10T14:20:00Z',
    status: 'completed' as const,
    paymentMethod: 'PayPal'
  }
];

const mockSponsorSponsorships = [
  {
    id: '1',
    sponsorName: 'Current Sponsor',
    sponsorEmail: 'sponsor@example.com',
    amount: 2000,
    currency: 'USD',
    projectId: 'proj-1',
    projectName: 'Community Website Redesign',
    volunteerId: 'vol-1',
    volunteerName: 'Jane Smith',
    duration: '3 months',
    createdAt: '2024-01-12T09:15:00Z',
    status: 'active' as const,
    sponsorshipType: 'project' as const
  },
  {
    id: '2',
    sponsorName: 'Current Sponsor',
    sponsorEmail: 'sponsor@example.com',
    amount: 1500,
    currency: 'USD',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-2',
    volunteerName: 'Mike Johnson',
    duration: '6 months',
    createdAt: '2024-01-08T16:30:00Z',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const
  }
];

export const SponsorDonationsView = () => {
  const [activeView, setActiveView] = useState<'list' | 'donate' | 'sponsor'>('list');
  const [donationsView, setDonationsView] = useState<'donations' | 'sponsorships'>('donations');

  const totalDonations = mockSponsorDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalSponsorships = mockSponsorSponsorships.reduce((sum, sponsorship) => sum + sponsorship.amount, 0);
  const activeSponsorships = mockSponsorSponsorships.filter(s => s.status === 'active').length;

  const handleFormSuccess = () => {
    setActiveView('list');
    // In real app, you'd refresh the data here
  };

  // Show donation form
  if (activeView === 'donate') {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setActiveView('list')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to My Donations & Sponsorships
        </Button>
        <DonationForm 
          onSuccess={handleFormSuccess}
          onCancel={() => setActiveView('list')}
        />
      </div>
    );
  }

  // Show sponsorship form
  if (activeView === 'sponsor') {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setActiveView('list')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to My Donations & Sponsorships
        </Button>
        <SponsorshipForm 
          onSuccess={handleFormSuccess}
          onCancel={() => setActiveView('list')}
        />
      </div>
    );
  }

  // Show main list view
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Total Donations</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockSponsorDonations.length} donations made
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Active Sponsorships</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalSponsorships.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {activeSponsorships} active sponsorships
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contribution</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${(totalDonations + totalSponsorships).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Overall impact
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setActiveView('donate')}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 size-4" />
          Make Donation
        </Button>
        <Button 
          onClick={() => setActiveView('sponsor')}
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="mr-2 size-4" />
          Create Sponsorship
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2 rounded-lg bg-muted p-1">
        <Button
          variant={donationsView === 'donations' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setDonationsView('donations')}
        >
          My Donations ({mockSponsorDonations.length})
        </Button>
        <Button
          variant={donationsView === 'sponsorships' ? 'default' : 'ghost'}
          className="flex-1"
          onClick={() => setDonationsView('sponsorships')}
        >
          My Sponsorships ({mockSponsorSponsorships.length})
        </Button>
      </div>

      {/* Content */}
      {donationsView === 'donations' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockSponsorDonations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
          {mockSponsorSponsorships.map((sponsorship) => (
            <SponsorshipCard key={sponsorship.id} sponsorship={sponsorship} />
          ))}
        </div>
      )}
    </div>
  );
};