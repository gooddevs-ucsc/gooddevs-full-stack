import {
  Heart,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  User,
  Wallet,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useReceivedSponsorships } from '@/features/sponsorships/api/get-received-sponsorships';
import { useWithdrawalBalance } from '@/features/sponsorships/api/get-withdrawal-balance';
import { WithdrawalRequestDialog } from '@/features/sponsorships/components/withdrawal-request-dialog';
import { PAYMENT_STATUS } from '@/types/api';

export const ReceivedSponsorshipsView = () => {
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'success' | 'pending' | 'failed'
  >('all');

  // Fetch received sponsorships from API
  const sponsorshipsQuery = useReceivedSponsorships({
    page: 1,
  });

  // Fetch withdrawal balance
  const balanceQuery = useWithdrawalBalance();

  const sponsorships = sponsorshipsQuery.data?.data || [];
  const balance = balanceQuery.data;

  // Filter sponsorships based on selected status
  const filteredSponsorships = sponsorships.filter((sponsorship) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'success')
      return sponsorship.payment?.status === PAYMENT_STATUS.SUCCESS;
    if (filterStatus === 'pending')
      return sponsorship.payment?.status === PAYMENT_STATUS.PENDING;
    if (filterStatus === 'failed')
      return (
        sponsorship.payment?.status === PAYMENT_STATUS.FAILED ||
        sponsorship.payment?.status === PAYMENT_STATUS.CANCELLED
      );
    return true;
  });

  // Calculate statistics
  const totalReceived = sponsorships
    .filter((s) => s.payment?.status === PAYMENT_STATUS.SUCCESS)
    .reduce((sum, sponsorship) => sum + (sponsorship.payment?.amount || 0), 0);

  const successfulSponsorships = sponsorships.filter(
    (s) => s.payment?.status === PAYMENT_STATUS.SUCCESS,
  ).length;

  const pendingSponsorships = sponsorships.filter(
    (s) => s.payment?.status === PAYMENT_STATUS.PENDING,
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
      {/* Withdrawal Balance Card */}
      {balance && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="size-5 text-green-600" />
                <CardTitle>Withdrawal Balance</CardTitle>
              </div>
              <WithdrawalRequestDialog
                availableBalance={balance.available_balance}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-gray-600">Total Received</p>
                <p className="text-xl font-bold text-gray-900">
                  LKR {balance.total_received.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Withdrawn</p>
                <p className="text-xl font-bold text-gray-900">
                  LKR {balance.total_withdrawn.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Withdrawals</p>
                <p className="text-xl font-bold text-yellow-600">
                  LKR {balance.pending_withdrawals.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  LKR {balance.available_balance.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              <AlertCircle className="size-4" />
              <p>A 6% processing fee will be deducted from all withdrawals.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Received
            </CardTitle>
            <TrendingUp className="size-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {totalReceived.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {successfulSponsorships} successful sponsorships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Sponsorships
            </CardTitle>
            <CheckCircle className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulSponsorships}</div>
            <p className="text-xs text-muted-foreground">
              Successfully received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Sponsorships
            </CardTitle>
            <Clock className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSponsorships}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="size-5 text-pink-600" />
              <CardTitle>Sponsorships Received</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Buttons */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              <div className="flex items-center">
                <Filter className="mr-2 size-3" />
                All ({sponsorships.length})
              </div>
            </Button>
            <Button
              variant={filterStatus === 'success' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('success')}
              size="sm"
            >
              <div className="flex items-center">
                <CheckCircle className="mr-2 size-3" />
                Completed ({successfulSponsorships})
              </div>
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              size="sm"
            >
              <div className="flex items-center">
                <Clock className="mr-2 size-3" />
                Pending ({pendingSponsorships})
              </div>
            </Button>
          </div>

          {/* Loading State */}
          {sponsorshipsQuery.isLoading && (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" className="text-pink-600" />
            </div>
          )}

          {/* Error State */}
          {sponsorshipsQuery.error && (
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <p className="text-red-800">
                Failed to load sponsorships. Please try again.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!sponsorshipsQuery.isLoading &&
            !sponsorshipsQuery.error &&
            filteredSponsorships.length === 0 && (
              <div className="py-12 text-center">
                <Heart className="mx-auto mb-4 size-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No sponsorships found
                </h3>
                <p className="mb-6 text-gray-600">
                  {filterStatus === 'all'
                    ? "You haven't received any sponsorships yet."
                    : `No ${filterStatus} sponsorships found.`}
                </p>
              </div>
            )}

          {/* Sponsorships List */}
          {!sponsorshipsQuery.isLoading &&
            !sponsorshipsQuery.error &&
            filteredSponsorships.length > 0 && (
              <div className="space-y-4">
                {filteredSponsorships.map((sponsorship) => (
                  <div
                    key={sponsorship.id}
                    className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <User className="size-4 text-pink-600" />
                          <h3 className="font-semibold text-gray-900">
                            From: {sponsorship.sponsor?.firstname}{' '}
                            {sponsorship.sponsor?.lastname}
                          </h3>
                          {getStatusBadge(sponsorship.payment?.status)}
                        </div>

                        <div className="mb-2 text-sm text-gray-600">
                          <span className="font-medium">Email:</span>{' '}
                          {sponsorship.sponsor?.email}
                        </div>

                        {sponsorship.message && (
                          <div className="mb-3 rounded bg-pink-50 p-3 text-sm text-gray-700">
                            <span className="font-medium">Message:</span>{' '}
                            {sponsorship.message}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {formatDate(sponsorship.created_at)}
                          </div>
                          <div className="font-medium">
                            Order #{sponsorship.order_id}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-pink-600">
                          LKR {sponsorship.payment?.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {sponsorship.payment?.currency}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};
