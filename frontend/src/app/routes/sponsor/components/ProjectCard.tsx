import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  title: string;
  description: string;
  onViewMore?: () => void;
}

export default function ProjectCard({ title, description, onViewMore }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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