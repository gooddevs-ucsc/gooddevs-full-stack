import type { Meta, StoryObj } from '@storybook/react';

import { PaymentForm } from './payment-form';

const meta: Meta<typeof PaymentForm> = {
  title: 'Components/PaymentForm',
  component: PaymentForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable payment form component for PayHere integration with form validation and responsive design. Payment details are provided as props and displayed read-only.',
      },
    },
  },
  argTypes: {
    merchantId: {
      description: 'PayHere merchant ID',
      control: 'text',
    },
    paymentDetails: {
      description: 'Payment details from backend',
      control: 'object',
    },
    returnUrl: {
      description: 'URL to redirect after successful payment',
      control: 'text',
    },
    cancelUrl: {
      description: 'URL to redirect after cancelled payment',
      control: 'text',
    },
    notifyUrl: {
      description: 'URL for payment notifications',
      control: 'text',
    },
    hash: {
      description: 'Payment security hash',
      control: 'text',
    },
    allowBillingEdit: {
      description: 'Show billing details form',
      control: 'boolean',
    },
    isLoading: {
      description: 'Show loading state',
      control: 'boolean',
    },
    title: {
      description: 'Form title',
      control: 'text',
    },
    description: {
      description: 'Form description',
      control: 'text',
    },
    submitButtonText: {
      description: 'Submit button text',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PaymentForm>;

export const Default: Story = {
  args: {
    merchantId: '1229437',
    paymentDetails: {
      orderId: 'ORDER-001',
      items: 'Premium Subscription',
      currency: 'LKR',
      amount: '2500',
    },
    returnUrl: 'http://sample.com/return',
    cancelUrl: 'http://sample.com/cancel',
    notifyUrl: 'http://sample.com/notify',
    hash: '38F3B6F985B8F84CFCA9FFAAB6035996',
    title: 'Payment Details',
    description: 'Complete your payment information below',
    submitButtonText: 'Pay Now',
  },
};

export const WithBillingDetails: Story = {
  args: {
    merchantId: '1229437',
    paymentDetails: {
      orderId: 'ORDER-12345',
      items: 'Premium Subscription',
      currency: 'LKR',
      amount: '2500',
    },
    returnUrl: 'http://sample.com/return',
    cancelUrl: 'http://sample.com/cancel',
    notifyUrl: 'http://sample.com/notify',
    hash: '38F3B6F985B8F84CFCA9FFAAB6035996',
    title: 'Payment Details',
    description: 'Complete your payment information below',
    submitButtonText: 'Pay Now',
    allowBillingEdit: true,
  },
};

export const PaymentOnly: Story = {
  args: {
    merchantId: '1229437',
    paymentDetails: {
      orderId: 'QUICK-001',
      items: 'Digital Download',
      currency: 'USD',
      amount: '19.99',
    },
    returnUrl: 'http://sample.com/return',
    cancelUrl: 'http://sample.com/cancel',
    notifyUrl: 'http://sample.com/notify',
    hash: '38F3B6F985B8F84CFCA9FFAAB6035996',
    allowBillingEdit: false,
    title: 'Quick Payment',
    description: 'Complete your payment quickly without billing details',
    submitButtonText: 'Pay Now',
  },
};

export const LoadingState: Story = {
  args: {
    merchantId: '1229437',
    paymentDetails: {
      orderId: 'ORDER-LOADING',
      items: 'Processing Payment',
      currency: 'LKR',
      amount: '1000',
    },
    returnUrl: 'http://sample.com/return',
    cancelUrl: 'http://sample.com/cancel',
    notifyUrl: 'http://sample.com/notify',
    hash: '38F3B6F985B8F84CFCA9FFAAB6035996',
    title: 'Payment Details',
    description: 'Complete your payment information below',
    isLoading: true,
    submitButtonText: 'Processing...',
  },
};

export const LargeAmount: Story = {
  args: {
    merchantId: '1229437',
    paymentDetails: {
      orderId: 'ORDER-BULK',
      items: 'Bulk purchase - 10x Premium licenses',
      currency: 'LKR',
      amount: '250000',
    },
    returnUrl: 'http://sample.com/return',
    cancelUrl: 'http://sample.com/cancel',
    notifyUrl: 'http://sample.com/notify',
    hash: '38F3B6F985B8F84CFCA9FFAAB6035996',
    className: 'max-w-md mx-auto shadow-xl border-2 border-primary',
    title: '🔒 Secure Payment',
    description: 'Your payment is protected by industry-standard encryption',
    submitButtonText: '💳 Pay Now',
  },
};

export const WithCustomSubmit: Story = {
  args: {
    merchantId: '1229437',
    paymentDetails: {
      orderId: 'CUSTOM-001',
      items: 'Custom Processing Item',
      currency: 'LKR',
      amount: '5000',
    },
    returnUrl: 'http://sample.com/return',
    cancelUrl: 'http://sample.com/cancel',
    notifyUrl: 'http://sample.com/notify',
    hash: '38F3B6F985B8F84CFCA9FFAAB6035996',
    title: 'Custom Payment Processing',
    description: 'This form will handle payment processing internally',
    submitButtonText: 'Process Payment',
    onSubmit: (data) => {
      console.log('Payment data:', data);
      alert(
        `Processing payment for ${data.paymentDetails.currency} ${data.paymentDetails.amount}`,
      );
    },
  },
};
