import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';

import {
  initiatePaymentInputSchema,
  useInitiatePayment,
} from '../api/initiate-payment';

export const TestPayment = () => {
  const initiatePaymentMutation = useInitiatePayment({
    mutationConfig: {
      onSuccess: (data) => {
        console.log('Payment initiated:', data);
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
