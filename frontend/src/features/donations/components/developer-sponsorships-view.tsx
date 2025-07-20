import { Users, TrendingUp, Plus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SponsorshipCard } from '@/components/ui/sponsorship-card';

import { SponsorshipForm } from './sponsorship-form';

// Mock data for current sponsor (filtered by sponsor email)
const mockSponsorSponsorships = [
  {
    id: '1',
    sponsorName: 'Jane Smith',
    sponsorEmail: 'jane@example.com',
    amount: 2000,
    currency: 'USD',
    projectId: 'proj-1',
    projectName: 'Fitness Tracker App',
    volunteerId: 'vol-1',
    volunteerName: 'Januli Nanayakkara',
    duration: '3 months',
    createdAt: '2024-01-12T09:15:00Z',
    status: 'active' as const,
    sponsorshipType: 'project' as const,
  },
  {
    id: '2',
    sponsorName: 'Jane Smith',
    sponsorEmail: 'jane@example.com',
    amount: 1500,
    currency: 'USD',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-1',
    volunteerName: 'Januli Nanayakkara',
    duration: '6 months',
    createdAt: '2024-01-08T16:30:00Z',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const,
  },
];

export const DeveloperSponsorshipsView = () => {
  const [activeView, setActiveView] = useState<'list' | 'sponsor'>('list');

  const totalSponsorships = mockSponsorSponsorships.reduce(
    (sum, sponsorship) => sum + sponsorship.amount,
    0,
  );
  const activeSponsorships = mockSponsorSponsorships.filter(
    (s) => s.status === 'active',
  ).length;

  const handleFormSuccess = () => {
    setActiveView('list');
    // In real app, you'd refresh the data here
  };

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
          Back to My Sponsorships
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
            <CardTitle className="text-sm font-medium">
              My Active Sponsorships
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${totalSponsorships.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeSponsorships} active sponsorships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contribution
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${totalSponsorships.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Overall impact</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex gap-4">
        <Button
          onClick={() => setActiveView('sponsor')}
          className="h-14 bg-blue-600 hover:bg-blue-700"
        >
          <span className="flex items-center">
            <Plus className="mr-4 size-4" />
            Create Sponsorship
          </span>
        </Button>
      </div>

      {/* Sponsorships List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockSponsorSponsorships.map((sponsorship) => (
          <SponsorshipCard key={sponsorship.id} sponsorship={sponsorship} />
        ))}
      </div>
    </div>
  );
};
