import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProjectApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  role: string;
  experience_level: string;
  motivation: string;
  relevant_experience: string;
  availability: string;
  preferred_technologies: string;
}

export default function ProjectApplicationForm({
  isOpen,
  onClose,
}: ProjectApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    role: '',
    experience_level: '',
    motivation: '',
    relevant_experience: '',
    availability: '',
    preferred_technologies: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Application submitted:', formData);
    onClose();
    setCurrentStep(1);
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      role: '',
      experience_level: '',
      motivation: '',
      relevant_experience: '',
      availability: '',
      preferred_technologies: '',
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                Personal Information
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Tell us about yourself
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstname"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  First Name *
                </label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) =>
                    handleInputChange('firstname', e.target.value)
                  }
                  placeholder="Enter your first name"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastname"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Last Name *
                </label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) =>
                    handleInputChange('lastname', e.target.value)
                  }
                  placeholder="Enter your last name"
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                Professional Links
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Share your professional profiles
              </p>
            </div>

            <div>
              <label
                htmlFor="linkedin"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                LinkedIn Profile
              </label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="github"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                GitHub Profile *
              </label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
                placeholder="https://github.com/yourusername"
                className="w-full"
                required
              />
            </div>

            <div>
              <label
                htmlFor="portfolio"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Portfolio Website
              </label>
              <Input
                id="portfolio"
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                Role & Experience
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Tell us about your skills and interests
              </p>
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Preferred Role *
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a role</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="fullstack">Full-Stack Developer</option>
                  <option value="uiux">UI/UX Designer</option>
                  <option value="mobile">Mobile Developer</option>
                  <option value="devops">DevOps Engineer</option>
                  <option value="qa">QA Engineer</option>
                  <option value="pm">Project Manager</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="experience_level"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Experience Level *
              </label>
              <div className="relative">
                <select
                  id="experience_level"
                  value={formData.experience_level}
                  onChange={(e) =>
                    handleInputChange('experience_level', e.target.value)
                  }
                  className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3-5 years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="preferred_technologies"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Preferred Technologies
              </label>
              <Input
                id="preferred_technologies"
                value={formData.preferred_technologies}
                onChange={(e) =>
                  handleInputChange('preferred_technologies', e.target.value)
                }
                placeholder="React, Node.js, Python, PostgreSQL, etc."
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="availability"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Weekly Availability *
              </label>
              <div className="relative">
                <select
                  id="availability"
                  value={formData.availability}
                  onChange={(e) =>
                    handleInputChange('availability', e.target.value)
                  }
                  className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select availability</option>
                  <option value="5-10">5-10 hours per week</option>
                  <option value="10-20">10-20 hours per week</option>
                  <option value="20-30">20-30 hours per week</option>
                  <option value="30+">30+ hours per week</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                Motivation & Experience
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Tell us why you&apos;re interested and about your relevant
                experience
              </p>
            </div>

            <div>
              <label
                htmlFor="motivation"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Why are you interested in this project? *
              </label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) =>
                  handleInputChange('motivation', e.target.value)
                }
                placeholder="Share what motivates you to contribute to this project..."
                className="min-h-[120px] w-full resize-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="relevant_experience"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Relevant Experience & Projects
              </label>
              <Textarea
                id="relevant_experience"
                value={formData.relevant_experience}
                onChange={(e) =>
                  handleInputChange('relevant_experience', e.target.value)
                }
                placeholder="Describe your relevant experience, projects, or skills that would be valuable for this project..."
                className="min-h-[120px] w-full resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Apply to Project
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="size-8 p-0 hover:bg-slate-100"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Step {currentStep} of 4
              </span>
              <span className="text-sm text-slate-500">
                {Math.round((currentStep / 4) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step indicators */}
          <div className="mt-4 flex justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="py-6">{renderStepContent()}</div>

        {/* Navigation buttons */}
        <div className="flex justify-between border-t border-slate-200 pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6"
          >
            Previous
          </Button>

          {currentStep === 4 ? (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-white hover:from-blue-700 hover:to-purple-700"
            >
              Submit Application
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-blue-600 px-6 text-white hover:bg-blue-700"
            >
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
