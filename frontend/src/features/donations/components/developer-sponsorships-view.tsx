import { Users, TrendingUp, Plus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SponsorshipCard } from '@/features/donations/components/sponsorship-card';

import { SponsorshipForm } from './sponsorship-form';

// Mock data for current sponsor (filtered by sponsor email)
const mockSponsorSponsorshipsDone = [
  {
    id: '1',
    sponsorName: 'Vihan Perera',
    sponsorEmail: 'vihan@gmail.com',
    amount: 30000,
    currency: 'LKR',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-1',
    volunteerName: 'Amal Gamage',
    duration: '3 months',
    createdAt: '2025-02-12T09:15:00Z',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const,
  },
  {
    id: '2',
    sponsorName: 'Vihan Perera',
    sponsorEmail: 'vihan@gmail.com',
    amount: 40000,
    currency: 'LKR',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-2',
    volunteerName: 'Sunil Silva',
    duration: '6 months',
    createdAt: '2025-01-08T16:30:00Z',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const,
  },
];

const mockSponsorSponsorshipsReceived = [
  {
    id: '3',
    sponsorName: 'Amith Perera',
    sponsorEmail: 'Amith@gmail.com',
    amount: 100000,
    currency: 'LKR',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-3',
    volunteerName: 'Vihan Perera',
    duration: '1 month',
    createdAt: '2025-06-15T10:00:00Z',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const,
  },
  {
    id: '4',
    sponsorName: 'Saman Silva',
    sponsorEmail: 'saman@gmail.com',
    amount: 50000,
    currency: 'LKR',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-3',
    volunteerName: 'Vihan Perera',
    duration: '3 months',
    createdAt: '2025-07-01',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const,
  },
];

export const DeveloperSponsorshipsView = () => {
  const [activeView, setActiveView] = useState<'list' | 'sponsor'>('list');
  const [tabValue, setTabValue] = useState('done');

  const totalSponsorships = mockSponsorSponsorshipsDone.reduce(
    (sum, sponsorship) => sum + sponsorship.amount,
    0,
  );

  const totalSponsorshipsReceived = mockSponsorSponsorshipsReceived.reduce(
    (sum, sponsorship) => sum + sponsorship.amount,
    0,
  );

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

  // Show main list view with tabs
  return (
    <div className="space-y-6">
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="done" className="flex items-center gap-2">
            <Users className="size-4" />
            Sponsorships Done
          </TabsTrigger>
          <TabsTrigger value="received" className="flex items-center gap-2">
            <TrendingUp className="size-4" />
            Received Sponsorships
          </TabsTrigger>
        </TabsList>

        {/* Sponsorships Done Tab */}
        <TabsContent value="done" className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sponsorships Done
                </CardTitle>
                <Users className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  Rs.{totalSponsorships.toLocaleString()}
                </div>
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
            {mockSponsorSponsorshipsDone.map((sponsorship) => (
              <SponsorshipCard key={sponsorship.id} sponsorship={sponsorship} />
            ))}
          </div>
        </TabsContent>

        {/* Received Sponsorships Tab */}
        <TabsContent value="received" className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sponsorships Received
                </CardTitle>
                <TrendingUp className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  Rs.{totalSponsorshipsReceived.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Replace with actual received sponsorships data */}
            {mockSponsorSponsorshipsReceived.map((sponsorship) => (
              <SponsorshipCard key={sponsorship.id} sponsorship={sponsorship} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
