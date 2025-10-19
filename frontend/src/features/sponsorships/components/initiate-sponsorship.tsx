import { Button } from '@/components/ui/button';
import { Form, Input, Select, Textarea } from '@/components/ui/form';
import { env } from '@/config/env';
import { paths } from '@/config/paths';
import { ProtectedRoute, useUser } from '@/lib/auth';
import { getCountryOptions } from '@/utils/countries';

import {
  initiateSponsorshipInputSchema,
  useInitiateSponsorship,
} from '../api/initiate-sponsorship';

interface InitiateSponsorshipProps {
  recipientId: string;
  recipientName?: string;
}

export const InitiateSponsorship = ({
  recipientId,
  recipientName,
}: InitiateSponsorshipProps) => {
  const user = useUser();

  // Determine the sponsorships path based on user role
  const getSponsorshipsPath = () => {
    const baseUrl = env.APP_URL || window.location.origin;
    let path = '';

    switch (user.data?.role) {
      case 'ADMIN':
        path = paths.admin.donationsSponshorships.getHref();
        break;
      case 'SPONSOR':
        path = paths.sponsor.donationsSponshorships.getHref();
        break;
      case 'REQUESTER':
        path = paths.requester.sponsorships.getHref();
        break;
      case 'VOLUNTEER':
        path = paths.developer.sponsorships.getHref();
        break;
      default:
        path = '/';
    }

    return `${baseUrl}${path}`;
  };

  const initiateSponsorshipMutation = useInitiateSponsorship({
    mutationConfig: {
      onSuccess: ({ data: paymentData }) => {
        const formElement = document.createElement('form');
        formElement.method = 'post';
        formElement.action = 'https://sandbox.payhere.lk/pay/checkout';

        const envUrl = import.meta.env.VITE_APP_APP_URL;
        const sponsorshipsUrl = envUrl ? getSponsorshipsPath() : null;

        const fields = {
          merchant_id: paymentData.merchant_id,
          return_url: sponsorshipsUrl || paymentData.return_url,
          cancel_url: sponsorshipsUrl || paymentData.cancel_url,
          notify_url: paymentData.notify_url,
          order_id: paymentData.order_id,
          items: paymentData.items,
          currency: paymentData.currency,
          amount: paymentData.amount,
          hash: paymentData.hash,
          first_name: paymentData.first_name,
          last_name: paymentData.last_name,
          email: paymentData.email,
          phone: paymentData.phone,
          address: paymentData.address,
          city: paymentData.city,
          country: paymentData.country,
        };

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          formElement.appendChild(input);
        });

        document.body.appendChild(formElement);
        formElement.submit();
        document.body.removeChild(formElement);
      },
    },
  });

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {recipientName && (
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="text-lg font-semibold text-blue-900">
              Sponsor {recipientName}
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Your sponsorship will help support this volunteer&apos;s
              contributions to the community.
            </p>
          </div>
        )}

        <Form
          id="initiate-sponsorship"
          onSubmit={(values) => {
            initiateSponsorshipMutation.mutate({
              recipientId,
              data: values,
            });
          }}
          schema={initiateSponsorshipInputSchema}
        >
          {({ register, formState }) => (
            <>
              <Input
                label="Phone"
                error={formState.errors['phone']}
                registration={register('phone')}
                placeholder="+94771234567"
              />
              <Input
                label="Address"
                error={formState.errors['address']}
                registration={register('address')}
                placeholder="123 Main Street"
              />
              <Input
                label="City"
                error={formState.errors['city']}
                registration={register('city')}
                placeholder="Colombo"
              />
              <Select
                label="Country"
                error={formState.errors['country']}
                registration={register('country')}
                options={getCountryOptions()}
              />
              <Input
                label="Amount"
                type="number"
                error={formState.errors['amount']}
                registration={register('amount', { valueAsNumber: true })}
                placeholder="1000"
              />
              <Textarea
                label="Message (Optional)"
                error={formState.errors['message']}
                registration={register('message')}
                placeholder="Leave a message of support for the volunteer..."
              />
              <div>
                <Button
                  isLoading={initiateSponsorshipMutation.isPending}
                  type="submit"
                  className="w-full"
                >
                  Proceed to Sponsor
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </ProtectedRoute>
  );
};
