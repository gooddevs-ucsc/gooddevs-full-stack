import {
  Building,
  Calendar,
  Clock,
  Mail,
  User,
  FolderOpen,
} from 'lucide-react';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';

interface Sponsorship {
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  amount: number;
  currency: string;
  projectId: string | null;
  projectName: string | null;
  volunteerId: string;
  volunteerName: string;
  duration: string;
  createdAt: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  sponsorshipType: 'volunteer';
}

interface SponsorshipCardProps {
  sponsorship: Sponsorship;
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
    active: 'bg-blue-50 text-blue-800 border border-blue-200',
    pending: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    completed: 'bg-green-50 text-green-800 border border-green-200',
    cancelled: 'bg-red-50 text-red-800 border border-red-200',
  };
  return colors[status as keyof typeof colors] || colors.pending;
};

export const SponsorshipCard: FC<SponsorshipCardProps> = ({ sponsorship }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-200/20 hover:ring-blue-200">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
              <Building className="size-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
                {sponsorship.sponsorName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(sponsorship.status)}>
                  {sponsorship.status}
                </Badge>
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-indigo-100 text-indigo-800">
                  Volunteer Sponsor
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              Rs.{sponsorship.amount.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">{sponsorship.currency}</div>
          </div>
        </div>

        <div className="mb-4 space-y-3">
          <div className="flex items-center text-sm text-slate-500">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-blue-100">
              <Mail className="size-3 text-blue-600" />
            </div>
            <span className="font-medium">Email:</span>
            <span className="ml-2 text-slate-700">
              {sponsorship.sponsorEmail}
            </span>
          </div>

          {sponsorship.projectName && (
            <div className="flex items-center text-sm text-slate-500">
              <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-purple-100">
                <FolderOpen className="size-3 text-purple-600" />
              </div>
              <span className="font-medium">Project:</span>
              <span className="ml-2 text-slate-700">
                {sponsorship.projectName}
              </span>
            </div>
          )}

          <div className="flex items-center text-sm text-slate-500">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-green-100">
              <User className="size-3 text-green-600" />
            </div>
            <span className="font-medium">Volunteer:</span>
            <span className="ml-2 text-slate-700">
              {sponsorship.volunteerName}
            </span>
          </div>

          <div className="flex items-center text-sm text-slate-500">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-amber-100">
              <Clock className="size-3 text-amber-600" />
            </div>
            <span className="font-medium">Duration:</span>
            <span className="ml-2 text-slate-700">{sponsorship.duration}</span>
          </div>

          <div className="flex items-center text-sm text-slate-500">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-emerald-100">
              <Calendar className="size-3 text-emerald-600" />
            </div>
            <span className="font-medium">Started:</span>
            <span className="ml-2 text-slate-700">
              {formatDate(sponsorship.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
