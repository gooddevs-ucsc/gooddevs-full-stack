import { Banknote, Info } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, Input } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import {
  RequestWithdrawalInput,
  requestWithdrawalInputSchema,
  useRequestWithdrawal,
} from '@/features/sponsorships/api/request-withdrawal';

type WithdrawalRequestDialogProps = {
  availableBalance: number;
};

export const WithdrawalRequestDialog = ({
  availableBalance,
}: WithdrawalRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const { addNotification } = useNotifications();
  const requestWithdrawalMutation = useRequestWithdrawal({
    mutationConfig: {
      onSuccess: (withdrawal) => {
        addNotification({
          type: 'success',
          title: 'Withdrawal Requested',
          message: `Your withdrawal of LKR ${withdrawal.amount_requested.toFixed(2)} has been requested successfully.`,
        });
        setOpen(false);
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          title: 'Withdrawal Failed',
          message:
            error?.response?.data?.detail || 'Failed to request withdrawal',
        });
      },
    },
  });

  const handleSubmit = (values: RequestWithdrawalInput) => {
    requestWithdrawalMutation.mutate(values);
  };

  const calculateFee = (amount: number) => {
    const fee = amount * 0.06;
    const amountToTransfer = amount - fee;
    return { fee, amountToTransfer };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto" disabled={availableBalance <= 0}>
          <div className="flex items-center">
            <Banknote className="mr-2 size-4" />
            Request Withdrawal
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Withdraw funds from your sponsorship balance. A 6% processing fee
            will be deducted.
          </DialogDescription>
        </DialogHeader>

        <Form
          id="withdrawal-request"
          onSubmit={handleSubmit}
          schema={requestWithdrawalInputSchema}
        >
          {({ register, formState, watch }) => {
            const amount = watch('amount') || 0;
            const { fee, amountToTransfer } = calculateFee(Number(amount));

            return (
              <>
                <div className="space-y-4 py-4">
                  {/* Available Balance Info */}
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex items-start gap-2">
                      <Info className="mt-0.5 size-4 text-blue-600" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Available Balance</p>
                        <p className="text-lg font-bold">
                          LKR {availableBalance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount Field */}
                  <Input
                    label="Withdrawal Amount (LKR)"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    registration={register('amount', { valueAsNumber: true })}
                    error={formState.errors['amount']}
                  />

                  {/* Fee Calculation */}
                  {amount > 0 && (
                    <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Requested Amount:</span>
                        <span className="font-medium">
                          LKR {Number(amount).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Processing Fee (6%):
                        </span>
                        <span className="font-medium text-red-600">
                          - LKR {fee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold text-gray-900">
                          You will receive:
                        </span>
                        <span className="font-bold text-green-600">
                          LKR {amountToTransfer.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bank Details */}
                  <Input
                    label="Bank Name"
                    placeholder="e.g., Commercial Bank"
                    registration={register('bank_name')}
                    error={formState.errors['bank_name']}
                  />

                  <Input
                    label="Bank Account Number"
                    placeholder="Enter your account number"
                    registration={register('bank_account_number')}
                    error={formState.errors['bank_account_number']}
                  />

                  <Input
                    label="Account Holder Name"
                    placeholder="Name as it appears on account"
                    registration={register('account_holder_name')}
                    error={formState.errors['account_holder_name']}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      requestWithdrawalMutation.isPending ||
                      Number(amount) > availableBalance ||
                      Number(amount) <= 0
                    }
                    isLoading={requestWithdrawalMutation.isPending}
                  >
                    Request Withdrawal
                  </Button>
                </DialogFooter>
              </>
            );
          }}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
