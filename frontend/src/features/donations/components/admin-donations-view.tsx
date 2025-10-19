import {
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Filter,
  TrendingUp,
  Activity,
  Mail,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  useAllDonations,
  useDonationStatistics,
} from '@/features/donations/api';
import { PAYMENT_STATUS } from '@/types/api';

export const AdminDonationsView = () => {
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'success' | 'pending' | 'failed'
  >('all');

  // Fetch all donations from API
  const donationsQuery = useAllDonations({
    limit: 100,
  });

  // Fetch donation statistics
  const statisticsQuery = useDonationStatistics();

  const donations = donationsQuery.data?.data || [];
  const statistics = statisticsQuery.data;

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return `Rs.${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            All Donations & Reports
          </h1>
          <p className="mt-1 text-slate-600">
            Monitor and analyze all donations in the system
          </p>
        </div>
        <Activity className="size-12 text-green-600" />
      </div>

      {/* Statistics Cards */}
      {statisticsQuery.isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : statisticsQuery.isError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4 text-center">
            <p className="text-sm text-red-700">Failed to load statistics</p>
          </CardContent>
        </Card>
      ) : (
        statistics && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-l-4 border-l-green-600 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Donations
                </CardTitle>
                <DollarSign className="size-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(statistics.total_amount)}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  From {statistics.total_donations} donations
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Average Donation
                </CardTitle>
                <TrendingUp className="size-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(statistics.average_donation)}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Per donation average
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Unique Donors
                </CardTitle>
                <Users className="size-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {statistics.unique_donors}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Active contributors
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-600 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Successful
                </CardTitle>
                <CheckCircle className="size-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {statistics.successful_donations}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Completed donations
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-600 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Pending
                </CardTitle>
                <Clock className="size-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {statistics.pending_donations}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Awaiting confirmation
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-600 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Success Rate
                </CardTitle>
                <Activity className="size-5 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {statistics.total_donations > 0
                    ? (
                        (statistics.successful_donations /
                          statistics.total_donations) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Completion percentage
                </p>
              </CardContent>
            </Card>
          </div>
        )
      )}

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
                Completed (
                {
                  donations.filter(
                    (d) => d.payment?.status === PAYMENT_STATUS.SUCCESS,
                  ).length
                }
                )
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
                Pending (
                {
                  donations.filter(
                    (d) => d.payment?.status === PAYMENT_STATUS.PENDING,
                  ).length
                }
                )
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
            <p className="mt-4 text-slate-600">Loading donations...</p>
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
            <DollarSign className="mx-auto size-16 text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              {donations.length === 0
                ? 'No donations found'
                : `No ${filterStatus} donations found`}
            </h3>
            <p className="mt-2 text-slate-600">
              {donations.length === 0
                ? 'There are no donations in the system yet.'
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
                          {formatCurrency(donation.payment?.amount || 0)}
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

                {/* Donor Information Section */}
                <div className="space-y-3 border-t border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-700">
                    Donor Information
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        {donation.donor?.firstname || 'Anonymous'}{' '}
                        {donation.donor?.lastname || ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        {donation.donor?.email || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                {donation.message && (
                  <div className="border-t border-slate-200 p-4">
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium text-blue-900">
                          Message:
                        </span>{' '}
                        &quot;{donation.message}&quot;
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Details Section */}
                <div className="border-t border-slate-200 bg-white p-4">
                  <h4 className="mb-2 text-sm font-semibold text-slate-700">
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-slate-500">Order ID:</span>
                      <p className="font-medium text-slate-900">
                        {donation.order_id}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Currency:</span>
                      <p className="font-medium text-slate-900">
                        {donation.payment?.currency || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">City:</span>
                      <p className="font-medium text-slate-900">
                        {donation.payment?.city || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Country:</span>
                      <p className="font-medium text-slate-900">
                        {donation.payment?.country || 'N/A'}
                      </p>
                    </div>
                  </div>
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
