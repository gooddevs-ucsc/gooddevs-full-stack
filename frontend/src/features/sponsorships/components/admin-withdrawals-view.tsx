import { useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  CheckCircle,
  Clock,
  Building2,
  CreditCard,
  Wallet,
  User,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableColumn } from '@/components/ui/table';
import { useCompleteWithdrawal } from '@/features/sponsorships/api/complete-withdrawal';
import {
  AllWithdrawal,
  useAllWithdrawals,
} from '@/features/sponsorships/api/get-all-withdrawals';

type WithdrawalStatusCellProps = {
  withdrawal: AllWithdrawal;
};

const WithdrawalStatusCell = ({ withdrawal }: WithdrawalStatusCellProps) => {
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  const completeWithdrawalMutation = useCompleteWithdrawal({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['all-withdrawals'],
        });
        addNotification({
          type: 'success',
          title: 'Withdrawal Completed',
          message: `Withdrawal of LKR ${withdrawal.amount_requested.toFixed(2)} has been marked as completed.`,
        });
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          title: 'Failed to Complete Withdrawal',
          message:
            error?.response?.data?.detail ||
            'Failed to complete withdrawal. Please try again.',
        });
      },
    },
  });

  const handleComplete = () => {
    completeWithdrawalMutation.mutate(withdrawal.id);
  };

  // Show completed if either the withdrawal status is completed OR the mutation just succeeded
  const isCompleted = withdrawal.status === 'COMPLETED';
  const isPending = withdrawal.status === 'PENDING';

  if (isCompleted) {
    return (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="mr-1 size-3" />
        Completed
      </Badge>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="mr-1 size-3" />
          Pending
        </Badge>
        <Button
          size="sm"
          variant="outline"
          onClick={handleComplete}
          disabled={completeWithdrawalMutation.isPending}
          className="h-7 text-xs"
        >
          {completeWithdrawalMutation.isPending ? (
            <>
              <Spinner size="sm" className="mr-1" />
              Completing...
            </>
          ) : (
            <>
              <div className="flex items-center">
                <CheckCircle className="mr-1 size-3" />
                Complete
              </div>
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Badge className="bg-gray-100 text-gray-800">
      <Clock className="mr-1 size-3" />
      {withdrawal.status}
    </Badge>
  );
};

export const AdminWithdrawalsView = () => {
  // Fetch all withdrawals (admin only)
  const withdrawalsQuery = useAllWithdrawals({
    page: 1,
  });

  const withdrawals = withdrawalsQuery.data?.data || [];

  // Calculate statistics
  const totalRequested = withdrawals.reduce(
    (sum: number, w: AllWithdrawal) => sum + w.amount_requested,
    0,
  );
  const totalCompleted = withdrawals
    .filter((w: AllWithdrawal) => w.status === 'COMPLETED')
    .reduce((sum: number, w: AllWithdrawal) => sum + w.amount_requested, 0);
  const totalPending = withdrawals
    .filter((w: AllWithdrawal) => w.status === 'PENDING')
    .reduce((sum: number, w: AllWithdrawal) => sum + w.amount_requested, 0);

  const completedCount = withdrawals.filter(
    (w: AllWithdrawal) => w.status === 'COMPLETED',
  ).length;
  const pendingCount = withdrawals.filter(
    (w: AllWithdrawal) => w.status === 'PENDING',
  ).length;

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

  // Define withdrawal table columns
  const withdrawalColumns: TableColumn<AllWithdrawal>[] = [
    {
      title: 'Recipient',
      field: 'recipient_id',
      Cell: ({ entry }) => (
        <div className="flex items-center gap-2">
          <User className="size-4 text-gray-400" />
          <div className="text-sm">
            <div className="font-medium">
              {entry.recipient?.firstname} {entry.recipient?.lastname}
            </div>
            <div className="text-xs text-gray-500">
              {entry.recipient?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Date',
      field: 'requested_at',
      Cell: ({ entry }) => (
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-gray-400" />
          <div>
            <div className="font-medium">{formatDate(entry.requested_at)}</div>
            {entry.completed_at && (
              <div className="text-xs text-gray-500">
                Completed: {formatDate(entry.completed_at)}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Amount Requested',
      field: 'amount_requested',
      Cell: ({ entry }) => (
        <div className="font-semibold text-gray-900">
          LKR {entry.amount_requested.toFixed(2)}
        </div>
      ),
    },
    {
      title: 'Fee (6%)',
      field: 'fee_amount',
      Cell: ({ entry }) => (
        <div className="font-medium text-red-600">
          - LKR {entry.fee_amount.toFixed(2)}
        </div>
      ),
    },
    {
      title: 'Amount to Transfer',
      field: 'amount_to_transfer',
      Cell: ({ entry }) => (
        <div className="font-semibold text-green-600">
          LKR {entry.amount_to_transfer.toFixed(2)}
        </div>
      ),
    },
    {
      title: 'Bank Details',
      field: 'bank_name',
      Cell: ({ entry }) => (
        <div className="flex items-start gap-2">
          <Building2 className="mt-0.5 size-4 shrink-0 text-gray-400" />
          <div className="space-y-1">
            <div className="font-medium">{entry.bank_name}</div>
            <div className="flex items-center gap-1 text-xs">
              <CreditCard className="size-3" />
              {entry.bank_account_number}
            </div>
            <div className="text-xs">{entry.account_holder_name}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      field: 'status',
      Cell: ({ entry }) => <WithdrawalStatusCell withdrawal={entry} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requested
            </CardTitle>
            <Wallet className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {totalRequested.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {withdrawals.length} withdrawals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Completed
            </CardTitle>
            <CheckCircle className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {totalCompleted.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedCount} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Clock className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {totalPending.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingCount} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <Wallet className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {(totalRequested * 0.06).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">6% processing fee</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="size-5 text-green-600" />
              <CardTitle>All Withdrawal Requests</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {withdrawalsQuery.isLoading && (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" className="text-green-600" />
            </div>
          )}

          {/* Error State */}
          {withdrawalsQuery.error && (
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <p className="text-red-800">
                Failed to load withdrawals. Please try again.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!withdrawalsQuery.isLoading &&
            !withdrawalsQuery.error &&
            withdrawals.length === 0 && (
              <div className="py-12 text-center">
                <Wallet className="mx-auto mb-4 size-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No withdrawal requests
                </h3>
                <p className="mb-6 text-gray-600">
                  No volunteers have requested withdrawals yet.
                </p>
              </div>
            )}

          {/* Withdrawals Table */}
          {!withdrawalsQuery.isLoading &&
            !withdrawalsQuery.error &&
            withdrawals.length > 0 && (
              <Table<AllWithdrawal>
                data={withdrawals}
                columns={withdrawalColumns}
              />
            )}
        </CardContent>
      </Card>
    </div>
  );
};
