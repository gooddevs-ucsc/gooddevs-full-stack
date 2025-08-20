import React from 'react';
import { z } from 'zod';

import { PaymentDetails } from '@/types/api';
import { cn } from '@/utils/cn';

import { Button } from '../button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../card';
import { Form } from '../form/form';
import { Input } from '../form/input';

// Billing details schema
const billingDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
});

// Payment form schema - only for billing details now
const paymentFormSchema = z.object({
  billingDetails: billingDetailsSchema.optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema> & {
  paymentDetails: PaymentDetails;
};
type BillingDetails = z.infer<typeof billingDetailsSchema>;

type PaymentFormProps = {
  merchantId: string;
  paymentDetails: PaymentDetails;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  hash: string;
  allowBillingEdit?: boolean;
  onSubmit?: (data: PaymentFormData) => void;
  className?: string;
  title: string;
  description: string;
  submitButtonText: string;
  isLoading?: boolean;
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  merchantId,
  paymentDetails,
  returnUrl,
  cancelUrl,
  notifyUrl,
  hash,
  allowBillingEdit = true,
  onSubmit,
  className,
  title,
  description,
  submitButtonText,
  isLoading = false,
}) => {
  const handleSubmit = (data: PaymentFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      // Default behavior: submit to PayHere
      const formElement = document.createElement('form');
      formElement.method = 'post';
      formElement.action = 'https://sandbox.payhere.lk/pay/checkout';

      // Add hidden fields
      const hiddenFields = {
        merchant_id: merchantId,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: notifyUrl,
        order_id: paymentDetails.orderId,
        items: paymentDetails.items,
        currency: paymentDetails.currency,
        amount: paymentDetails.amount,
        hash: hash,
      };

      // Add billing details if provided
      if (data.billingDetails) {
        Object.assign(hiddenFields, {
          first_name: data.billingDetails.firstName,
          last_name: data.billingDetails.lastName,
          email: data.billingDetails.email,
          phone: data.billingDetails.phone,
          address: data.billingDetails.address,
          city: data.billingDetails.city,
          country: data.billingDetails.country,
        });
      }

      // Create and append hidden input fields
      Object.entries(hiddenFields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        formElement.appendChild(input);
      });

      // Submit the form
      document.body.appendChild(formElement);
      formElement.submit();
      document.body.removeChild(formElement);
    }
  };

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={handleSubmit}
          schema={paymentFormSchema}
          options={{
            defaultValues: {
              paymentDetails,
              billingDetails: allowBillingEdit
                ? {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    country: '',
                  }
                : undefined,
            },
          }}
        >
          {({ register, formState }) => (
            <>
              {/* Payment Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Payment Summary
                </h3>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Order ID
                      </p>
                      <p className="font-mono text-sm">
                        {paymentDetails.orderId}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Currency
                      </p>
                      <p className="text-sm">{paymentDetails.currency}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Items
                    </p>
                    <p className="text-sm">{paymentDetails.items}</p>
                  </div>

                  <div className="mt-3 space-y-1 border-t pt-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-lg font-semibold">
                      {paymentDetails.currency}{' '}
                      {parseFloat(paymentDetails.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing Details Section */}
              {allowBillingEdit && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Billing Details
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="First Name"
                      type="text"
                      placeholder="Enter first name"
                      registration={register('billingDetails.firstName')}
                      error={formState.errors.billingDetails?.firstName}
                    />

                    <Input
                      label="Last Name"
                      type="text"
                      placeholder="Enter last name"
                      registration={register('billingDetails.lastName')}
                      error={formState.errors.billingDetails?.lastName}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter email address"
                      registration={register('billingDetails.email')}
                      error={formState.errors.billingDetails?.email}
                    />

                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="Enter phone number"
                      registration={register('billingDetails.phone')}
                      error={formState.errors.billingDetails?.phone}
                    />
                  </div>

                  <Input
                    label="Address"
                    type="text"
                    placeholder="Enter street address"
                    registration={register('billingDetails.address')}
                    error={formState.errors.billingDetails?.address}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="City"
                      type="text"
                      placeholder="Enter city"
                      registration={register('billingDetails.city')}
                      error={formState.errors.billingDetails?.city}
                    />

                    <Input
                      label="Country"
                      type="text"
                      placeholder="Enter country"
                      registration={register('billingDetails.country')}
                      error={formState.errors.billingDetails?.country}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full md:w-auto"
                >
                  {submitButtonText}
                </Button>
              </div>
            </>
          )}
        </Form>
      </CardContent>
    </Card>
  );
};

export {
  PaymentForm,
  type PaymentFormProps,
  type PaymentFormData,
  type BillingDetails,
};
