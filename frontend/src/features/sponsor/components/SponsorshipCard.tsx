import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface SponsorshipCardProps {
  title: string;
  amount: string;
  onViewMore?: () => void;
}

export default function SponsorshipCard({ title, amount, onViewMore }: SponsorshipCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{title}</h3>
          <div className="bg-orange-100 rounded-lg p-2">
            <Star className="h-5 w-5 text-orange-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{amount}</p>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={onViewMore}
          >
            View More
          </Button>
        </div>
      </div>
    </div>
  );
}