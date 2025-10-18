import { CreditCard, ExternalLink, MoreVertical } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string | null;
  amount: number;
  currency: string;
  message: string | null;
  createdAt: string;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: string;
}

interface DonationCardProps {
  donation: Donation;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const DonationCard: FC<DonationCardProps> = ({ donation }) => {
  const handleViewDetails = () => {
    console.log('View donation details:', donation.id);
    // Implement view details functionality
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-primary">
              {formatDate(donation.createdAt)}
            </h3>
          </div>

          {/* Amount Section */}
          <div className="mb-4 text-right">
            <div className="text-2xl font-bold text-green-600">
              Rs.{donation.amount.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">{donation.currency}</div>
          </div>

          {/* Options Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 rounded-full p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleViewDetails}
                className="cursor-pointer"
              >
                <ExternalLink className="mr-2 size-4" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sponsorship Details */}
        <div className="space-y-3 text-sm text-slate-500">
          <div className="flex items-center">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-green-100">
              <CreditCard className="size-3 text-green-600" />{' '}
            </div>
            <span className="font-medium">Payment:</span>
            <span className="ml-2 text-slate-700">
              {donation.paymentMethod}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
