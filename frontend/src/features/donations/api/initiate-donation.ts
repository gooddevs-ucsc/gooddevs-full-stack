import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { InitiatePaymentResponse } from '@/types/api';

export const initiateDonationInputSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must be less than 500 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(255, 'City must be less than 255 characters'),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(255, 'Country must be less than 255 characters'),
  message: z
    .string()
    .max(500, 'Message must be less than 500 characters')
    .optional(),
});

export type InitiateDonationInput = z.infer<typeof initiateDonationInputSchema>;

export const initiateDonation = ({
  data,
}: {
  data: InitiateDonationInput;
}): Promise<InitiatePaymentResponse> => {
  return api.post(`/donations/initiate`, data);
};

type UseInitiateDonationOptions = {
  mutationConfig?: MutationConfig<typeof initiateDonation>;
};

export const useInitiateDonation = ({
  mutationConfig,
}: UseInitiateDonationOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: initiateDonation,
  });
};
