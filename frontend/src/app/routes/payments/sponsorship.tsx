import { ArrowLeft, User, Mail, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts/content-layout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { InitiateSponsorship } from '@/features/sponsorships';
import { usePublicUserProfile } from '@/lib/public-profile-api';

const SponsorshipRoute = () => {
  const { recipientId } = useParams<{ recipientId: string }>();
  const navigate = useNavigate();

  // Fetch volunteer profile
  const { data: profileData, isLoading: isLoadingProfile } =
    usePublicUserProfile({
      userId: recipientId || '',
      queryConfig: {
        enabled: !!recipientId,
      },
    });

  const volunteer = profileData?.data;
  const volunteerName = volunteer
    ? `${volunteer.firstname} ${volunteer.lastname}`.trim()
    : 'Volunteer';

  if (!recipientId) {
    return (
      <ContentLayout title="Sponsor Volunteer">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-red-800">Invalid volunteer ID</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Sponsor a Volunteer">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <div className="flex items-center">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </div>
        </Button>

        {/* Volunteer Details Card */}
        {isLoadingProfile ? (
          <div className="mb-6 flex items-center justify-center rounded-lg border border-slate-200 bg-white p-8">
            <Spinner className="size-6" />
          </div>
        ) : volunteer ? (
          <div className="mb-6 rounded-lg border border-slate-200 bg-gradient-to-br from-pink-50 to-purple-50 p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                <User className="size-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {volunteerName}
                </h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Mail className="size-4" />
                    {volunteer.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="size-4" />
                    {volunteer.role}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white/80 p-4">
              <p className="text-sm text-slate-700">
                Your sponsorship will directly support{' '}
                <span className="font-semibold">{volunteerName}</span> and help
                them continue making valuable contributions to the community
                through their volunteer work.
              </p>
              <div className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-900">
                <p className="font-medium">
                  Platform Fee: A 6% fee will be deducted to maintain the
                  platform and cover transaction costs.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <InitiateSponsorship
          recipientId={recipientId}
          recipientName={volunteerName}
        />
      </div>
    </ContentLayout>
  );
};

export default SponsorshipRoute;
