import { Calendar, DollarSign, Mail, User } from 'lucide-react';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string | null;
  amount: number;
  currency: string;
  message: string | null;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
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
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'bg-green-50 text-green-800 border border-green-200',
    pending: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    failed: 'bg-red-50 text-red-800 border border-red-200',
  };
  return colors[status as keyof typeof colors] || colors.completed;
};

export const DonationCard: FC<DonationCardProps> = ({ donation }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:border-green-300 hover:shadow-xl hover:shadow-green-200/20 hover:ring-green-200">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative p-6">
        
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
              <User className="size-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-green-600">
                {donation.donorName}
              </h3>
              <Badge className={getStatusColor(donation.status)}>
                {donation.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${donation.amount.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">{donation.currency}</div>
          </div>
        </div>

        <div className="mb-4 space-y-3">
          {donation.donorEmail && (
            <div className="flex items-center text-sm text-slate-500">
              <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-blue-100">
                <Mail className="size-3 text-blue-600" />
              </div>
              <span className="font-medium">Email:</span>
              <span className="ml-2 text-slate-700">{donation.donorEmail}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-slate-500">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-purple-100">
              <DollarSign className="size-3 text-purple-600" />
            </div>
            <span className="font-medium">Method:</span>
            <span className="ml-2 text-slate-700">{donation.paymentMethod}</span>
          </div>

          <div className="flex items-center text-sm text-slate-500">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-emerald-100">
              <Calendar className="size-3 text-emerald-600" />
            </div>
            <span className="font-medium">Date:</span>
            <span className="ml-2 text-slate-700">{formatDate(donation.createdAt)}</span>
          </div>
        </div>

        {donation.message && (
          <div className="rounded-lg bg-slate-50 border-l-4 border-green-500 p-3">
            <p className="text-sm text-slate-700 italic">"{donation.message}"</p>
          </div>
        )}
      </div>
    </div>
  );
};