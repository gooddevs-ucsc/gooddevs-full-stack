import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';

import {
  initiatePaymentInputSchema,
  useInitiatePayment,
} from '../api/initiate-payment';

export const TestPayment = () => {
  const initiatePaymentMutation = useInitiatePayment({
    mutationConfig: {
      onSuccess: ({ data: paymentData }) => {
        const formElement = document.createElement('form');
        formElement.method = 'post';
        formElement.action = 'https://sandbox.payhere.lk/pay/checkout';

        // Add hidden fields
        const fileds = {
          merchant_id: paymentData.merchant_id,
          return_url: paymentData.return_url,
          cancel_url: paymentData.cancel_url,
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
        Object.entries(fileds).forEach(([key, value]) => {
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
    <Form
      id="initiate-payment"
      onSubmit={(values) => {
        initiatePaymentMutation.mutate({ data: values });
      }}
      schema={initiatePaymentInputSchema}
    >
      {({ register, formState }) => (
        <>
          <Input
            label="First Name"
            error={formState.errors['first_name']}
            registration={register('first_name')}
          />
          <Input
            label="Last Name"
            error={formState.errors['last_name']}
            registration={register('last_name')}
          />
          <Input
            label="Email"
            type="email"
            error={formState.errors['email']}
            registration={register('email')}
          />
          <Input
            label="Phone"
            error={formState.errors['phone']}
            registration={register('phone')}
          />
          <Input
            label="Address"
            error={formState.errors['address']}
            registration={register('address')}
          />
          <Input
            label="City"
            error={formState.errors['city']}
            registration={register('city')}
          />
          <Input
            label="Country"
            error={formState.errors['country']}
            registration={register('country')}
          />
          <Input
            label="Amount"
            type="number"
            error={formState.errors['amount']}
            registration={register('amount', { valueAsNumber: true })}
          />
          <div>
            <Button
              isLoading={initiatePaymentMutation.isPending}
              type="submit"
              className="w-full"
            >
              Proceed to pay
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};
