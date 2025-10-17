import {
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Gift,
  Filter,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useMyDonations } from '@/features/donations/api';
import { PAYMENT_STATUS } from '@/types/api';

export const MyDonationsView = () => {
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'success' | 'pending' | 'failed'
  >('all');

  // Fetch user's donations from API
  const donationsQuery = useMyDonations({
    limit: 100,
  });

  const donations = donationsQuery.data?.data || [];

  // Filter donations based on selected status
  const filteredDonations = donations.filter((donation) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'success')
      return donation.payment?.status === PAYMENT_STATUS.SUCCESS;
    if (filterStatus === 'pending')
      return donation.payment?.status === PAYMENT_STATUS.PENDING;
    if (filterStatus === 'failed')
      return (
        donation.payment?.status === PAYMENT_STATUS.FAILED ||
        donation.payment?.status === PAYMENT_STATUS.CANCELLED
      );
    return true;
  });

  // Calculate statistics
  const totalDonations = donations
    .filter((d) => d.payment?.status === PAYMENT_STATUS.SUCCESS)
    .reduce((sum, donation) => sum + (donation.payment?.amount || 0), 0);

  const successfulDonations = donations.filter(
    (d) => d.payment?.status === PAYMENT_STATUS.SUCCESS,
  ).length;

  const pendingDonations = donations.filter(
    (d) => d.payment?.status === PAYMENT_STATUS.PENDING,
  ).length;

  // Get status color and icon
  const getStatusBadge = (status: number | undefined) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 size-3" />
            Completed
          </Badge>
        );
      case PAYMENT_STATUS.PENDING:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 size-3" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Clock className="mr-1 size-3" />
            Unknown
          </Badge>
        );
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Donations</h1>
          <p className="mt-1 text-slate-600">
            Track your donation history and impact
          </p>
        </div>
        <Gift className="size-12 text-green-600" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Donated
            </CardTitle>
            <DollarSign className="size-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              Rs.{totalDonations.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              From {successfulDonations} successful donations
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Completed
            </CardTitle>
            <CheckCircle className="size-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {successfulDonations}
            </div>
            <p className="mt-1 text-xs text-slate-500">Successful donations</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending
            </CardTitle>
            <Clock className="size-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {pendingDonations}
            </div>
            <p className="mt-1 text-xs text-slate-500">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filter Donations
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All ({donations.length})
            </Button>
            <Button
              variant={filterStatus === 'success' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('success')}
              className={
                filterStatus === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : ''
              }
            >
              <div className="flex items-center">
                <CheckCircle className="mr-1 size-4" />
                Completed ({successfulDonations})
              </div>
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
              className={
                filterStatus === 'pending'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : ''
              }
            >
              <div className="flex items-center">
                <Clock className="mr-1 size-4" />
                Pending ({pendingDonations})
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      {donationsQuery.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-slate-600">Loading your donations...</p>
          </div>
        </div>
      ) : donationsQuery.isError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-12 text-center">
            <XCircle className="mx-auto size-12 text-red-600" />
            <p className="mt-4 text-lg font-semibold text-red-900">
              Failed to load donations
            </p>
            <p className="mt-2 text-sm text-red-700">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
            <Button
              onClick={() => donationsQuery.refetch()}
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredDonations.length === 0 ? (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-20 text-center">
            <Gift className="mx-auto size-16 text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              {donations.length === 0
                ? "You haven't made any donations yet"
                : `No ${filterStatus} donations found`}
            </h3>
            <p className="mt-2 text-slate-600">
              {donations.length === 0
                ? 'Start making a difference today by supporting the community!'
                : 'Try selecting a different filter to view other donations.'}
            </p>
            {filterStatus !== 'all' && donations.length > 0 && (
              <Button
                onClick={() => setFilterStatus('all')}
                variant="outline"
                className="mt-4"
              >
                View All Donations
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDonations.map((donation) => (
            <Card
              key={donation.id}
              className="overflow-hidden transition-all hover:border-green-200 hover:shadow-md"
            >
              <CardContent className="p-0">
                {/* Header Section with Color Bar */}
                <div
                  className={`p-4 ${
                    donation.payment?.status === PAYMENT_STATUS.SUCCESS
                      ? 'border-l-4 border-l-green-600 bg-gradient-to-r from-green-50 to-emerald-50'
                      : donation.payment?.status === PAYMENT_STATUS.PENDING
                        ? 'border-l-4 border-l-yellow-600 bg-gradient-to-r from-yellow-50 to-amber-50'
                        : 'border-l-4 border-l-slate-400 bg-gradient-to-r from-slate-50 to-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="size-8 rounded-full bg-white p-1.5 text-green-700 shadow-sm" />
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          Rs.{donation.payment?.amount?.toLocaleString()}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar className="size-3.5 text-slate-500" />
                          <span className="text-sm text-slate-600">
                            {donation.payment?.created_at
                              ? formatDate(donation.payment.created_at)
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(donation.payment?.status)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-3 p-4">
                  {/* Message */}
                  {donation.message && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium text-blue-900">
                          Message:
                        </span>{' '}
                        &quot;{donation.message}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {filteredDonations.length > 0 && !donationsQuery.isLoading && (
        <Card className="bg-slate-50">
          <CardContent className="py-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Showing{' '}
                <span className="font-semibold text-slate-900">
                  {filteredDonations.length}
                </span>{' '}
                {filterStatus !== 'all' ? `${filterStatus} ` : ''}
                {filteredDonations.length === 1 ? 'donation' : 'donations'}
                {filterStatus !== 'all' && (
                  <>
                    {' '}
                    of{' '}
                    <span className="font-semibold text-slate-900">
                      {donations.length}
                    </span>{' '}
                    total
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
