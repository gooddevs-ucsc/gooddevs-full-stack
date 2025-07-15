import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Loader2 } from 'lucide-react';

const Input = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
    {...props}
  />
);

const Label = ({ ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    {...props}
  />
);

// Create a simple Select using native HTML select
const Select = ({ 
  value, 
  onValueChange, 
  children, 
  placeholder 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
  children: React.ReactNode;
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {placeholder && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {children}
  </select>
);

const SelectItem = ({ 
  value, 
  children 
}: { 
  value: string; 
  children: React.ReactNode; 
}) => (
  <option value={value}>{children}</option>
);

interface SponsorshipFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const mockProjects = [
  { id: 'proj-1', name: 'Community Website Redesign' },
  { id: 'proj-2', name: 'Mobile App Development' },
  { id: 'proj-3', name: 'Open Source Library' }
];

const mockVolunteers = [
  { id: 'vol-1', name: 'Jane Smith' },
  { id: 'vol-2', name: 'Mike Johnson' },
  { id: 'vol-3', name: 'Sarah Wilson' }
];

export const SponsorshipForm = ({ onSuccess, onCancel }: SponsorshipFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    sponsorName: '',
    sponsorEmail: '',
    amount: '',
    currency: 'USD',
    sponsorshipType: '',
    projectId: '',
    volunteerId: '',
    duration: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Sponsorship submitted:', formData);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit sponsorship:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5 text-blue-600" />
          Create Sponsorship
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sponsorName">Your Name/Company</Label>
              <Input
                id="sponsorName"
                value={formData.sponsorName}
                onChange={(e) => handleInputChange('sponsorName', e.target.value)}
                placeholder="Enter name or company"
                required
              />
            </div>
            <div>
              <Label htmlFor="sponsorEmail">Email</Label>
              <Input
                id="sponsorEmail"
                type="email"
                value={formData.sponsorEmail}
                onChange={(e) => handleInputChange('sponsorEmail', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sponsorshipType">Sponsorship Type</Label>
            <Select 
              value={formData.sponsorshipType} 
              onValueChange={(value) => handleInputChange('sponsorshipType', value)}
              placeholder="Select sponsorship type"
            >
              <SelectItem value="project">Project Sponsorship</SelectItem>
              <SelectItem value="volunteer">Volunteer Sponsorship</SelectItem>
            </Select>
          </div>

          {formData.sponsorshipType === 'project' && (
            <div>
              <Label htmlFor="projectId">Select Project</Label>
              <Select 
                value={formData.projectId} 
                onValueChange={(value) => handleInputChange('projectId', value)}
                placeholder="Select a project"
              >
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="volunteerId">Select Volunteer</Label>
            <Select 
              value={formData.volunteerId} 
              onValueChange={(value) => handleInputChange('volunteerId', value)}
              placeholder="Select a volunteer"
            >
              {mockVolunteers.map((volunteer) => (
                <SelectItem key={volunteer.id} value={volunteer.id}>
                  {volunteer.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="1000"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select 
                value={formData.duration} 
                onValueChange={(value) => handleInputChange('duration', value)}
                placeholder="Select duration"
              >
                <SelectItem value="1 month">1 month</SelectItem>
                <SelectItem value="3 months">3 months</SelectItem>
                <SelectItem value="6 months">6 months</SelectItem>
                <SelectItem value="1 year">1 year</SelectItem>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Create Sponsorship'
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};