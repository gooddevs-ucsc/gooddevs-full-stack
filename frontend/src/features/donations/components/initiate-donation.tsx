import { Button } from '@/components/ui/button';
import { Form, Input, Select, Textarea } from '@/components/ui/form';
import { env } from '@/config/env';
import { paths } from '@/config/paths';
import { ProtectedRoute, useUser } from '@/lib/auth';
import { getCountryOptions } from '@/utils/countries';

import {
  initiateDonationInputSchema,
  useInitiateDonation,
} from '../api/initiate-donation';

export const InitiateDonation = () => {
  const user = useUser();

  // Determine the my-donations path based on user role
  const getMyDonationsPath = () => {
    // Try to get base URL from environment variable, fallback to window.location.origin
    const baseUrl = env.APP_URL || window.location.origin;
    let path = '';

    switch (user.data?.role) {
      case 'ADMIN':
        path = paths.admin.myDonations.getHref();
        break;
      case 'SPONSOR':
        path = paths.sponsor.myDonations.getHref();
        break;
      case 'REQUESTER':
        path = paths.requester.myDonations.getHref();
        break;
      case 'VOLUNTEER':
        path = paths.developer.myDonations.getHref();
        break;
      default:
        path = '/';
    }

    return `${baseUrl}${path}`;
  };

  const initiateDonationMutation = useInitiateDonation({
    mutationConfig: {
      onSuccess: ({ data: paymentData }) => {
        const formElement = document.createElement('form');
        formElement.method = 'post';
        formElement.action = 'https://sandbox.payhere.lk/pay/checkout';

        // Get the role-specific my-donations URL if env variable exists
        // Otherwise use the return_url and cancel_url from backend payment data
        const envUrl = import.meta.env.VITE_APP_APP_URL;
        const myDonationsUrl = envUrl ? getMyDonationsPath() : null;

        // Add hidden fields - use custom URLs if env is set, otherwise use backend URLs
        const fields = {
          merchant_id: paymentData.merchant_id,
          return_url: myDonationsUrl || paymentData.return_url,
          cancel_url: myDonationsUrl || paymentData.cancel_url,
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

        // Create and append hidden input fields
        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          formElement.appendChild(input);
        });

        // Submit the form
        document.body.appendChild(formElement);
        formElement.submit();
        document.body.removeChild(formElement);
      },
    },
  });

  return (
    <ProtectedRoute>
      <Form
        id="initiate-donation"
        onSubmit={(values) => {
          initiateDonationMutation.mutate({ data: values });
        }}
        schema={initiateDonationInputSchema}
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
              placeholder="Leave a message of support..."
            />
            <div>
              <Button
                isLoading={initiateDonationMutation.isPending}
                type="submit"
                className="w-full"
              >
                Proceed to Donate
              </Button>
            </div>
          </>
        )}
      </Form>
    </ProtectedRoute>
  );
};
