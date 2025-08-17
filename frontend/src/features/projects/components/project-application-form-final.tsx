import { ChevronDown } from 'lucide-react';
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
import { useUser } from '@/lib/auth';
import {
  Project,
  DeveloperRole,
  ExperienceLevel,
  Availability,
} from '@/types/api';

import { useCreateProjectApplication } from '../api/create-project-application';

// Helper function to validate URLs
const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

interface ProjectApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

interface FormData {
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
  project,
}: ProjectApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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

  // Get current user data
  const { data: user } = useUser();

  const { mutate: createApplication, isPending: isSubmitting } =
    useCreateProjectApplication({
      mutationConfig: {
        onSuccess: () => {
          console.log('Application submitted successfully!');
          setShowSuccess(true);
          // Reset form after a delay
          setTimeout(() => {
            setShowSuccess(false);
            setCurrentStep(1);
            setFormData({
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
            setErrors({});
            onClose();
          }, 3000); // Show success message for 3 seconds
        },
        onError: (error: any) => {
          console.error('Failed to submit application:', error);
          console.error('Error response:', error.response?.data);
          console.error('Error status:', error.response?.status);
          console.error('Validation errors:', error.response?.data?.detail);

          // If it's a validation error, try to parse and display the specific issues
          if (error.response?.status === 422 && error.response?.data?.detail) {
            console.group('🔍 Validation Error Details:');
            if (Array.isArray(error.response.data.detail)) {
              error.response.data.detail.forEach((err: any) => {
                console.error(
                  `Field: ${err.loc?.join('.')} | Error: ${err.msg} | Input: ${err.input}`,
                );
              });
            } else {
              console.error('Detail:', error.response.data.detail);
            }
            console.groupEnd();
          }
        },
      },
    });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Validation functions
  const validateStep = (step: number): boolean => {
    const stepErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.github.trim())
          stepErrors.github = 'GitHub profile is required';
        else if (formData.github.trim() && !isValidUrl(formData.github))
          stepErrors.github = 'Please enter a valid GitHub URL';

        if (formData.linkedin.trim() && !isValidUrl(formData.linkedin))
          stepErrors.linkedin = 'Please enter a valid LinkedIn URL';

        if (formData.portfolio.trim() && !isValidUrl(formData.portfolio))
          stepErrors.portfolio = 'Please enter a valid portfolio URL';
        break;
      case 2:
        if (!formData.role) stepErrors.role = 'Please select a role';
        if (!formData.experience_level)
          stepErrors.experience_level = 'Please select experience level';
        if (!formData.availability)
          stepErrors.availability = 'Please select availability';
        break;
      case 3:
        if (!formData.motivation.trim())
          stepErrors.motivation = 'Motivation is required';
        else if (formData.motivation.trim().length < 10)
          stepErrors.motivation = 'Motivation must be at least 10 characters';
        break;
    }

    // Update only the errors for the current step
    setErrors((prev) => ({
      ...prev,
      ...stepErrors,
    }));

    return Object.keys(stepErrors).length === 0;
  };

  const validateAllSteps = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Required fields validation
    if (!formData.github.trim())
      newErrors.github = 'GitHub profile is required';
    else if (formData.github.trim() && !isValidUrl(formData.github))
      newErrors.github = 'Please enter a valid GitHub URL';

    if (formData.linkedin.trim() && !isValidUrl(formData.linkedin))
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';

    if (formData.portfolio.trim() && !isValidUrl(formData.portfolio))
      newErrors.portfolio = 'Please enter a valid portfolio URL';
    if (!formData.role) newErrors.role = 'Please select a role';
    if (!formData.experience_level)
      newErrors.experience_level = 'Please select experience level';
    if (!formData.availability)
      newErrors.availability = 'Please select availability';
    if (!formData.motivation.trim())
      newErrors.motivation = 'Motivation is required';
    else if (formData.motivation.trim().length < 10)
      newErrors.motivation = 'Motivation must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    console.log('Submit clicked!', { formData, project });

    if (!validateAllSteps()) {
      console.log('Validation failed, errors:', errors);
      // Find first step with errors
      for (let step = 1; step <= 3; step++) {
        if (!validateStep(step)) {
          setCurrentStep(step);
          break;
        }
      }
      return;
    }

    console.log('Validation passed, submitting...');
    console.log('Form data to submit:', {
      linkedin: formData.linkedin || undefined,
      github: formData.github,
      portfolio: formData.portfolio || undefined,
      role: formData.role,
      experience_level: formData.experience_level,
      motivation: formData.motivation,
      relevant_experience: formData.relevant_experience || undefined,
      availability: formData.availability,
      preferred_technologies: formData.preferred_technologies || undefined,
    });

    // Submit application using the API
    try {
      const submitData = {
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        phone: undefined, // We can add phone to user profile later
        linkedin: formData.linkedin?.trim() || undefined,
        github: formData.github,
        portfolio: formData.portfolio?.trim() || undefined,
        role: formData.role as DeveloperRole,
        experience_level: formData.experience_level as ExperienceLevel,
        motivation: formData.motivation,
        relevant_experience: formData.relevant_experience?.trim() || undefined,
        availability: formData.availability as Availability,
        preferred_technologies:
          formData.preferred_technologies?.trim() || undefined,
      };

      console.log('Final submit data:', submitData);

      createApplication({
        data: submitData,
        projectId: project.id,
      });
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
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
                className={`w-full ${
                  errors.linkedin ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.linkedin && (
                <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
              )}
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
                className={`w-full ${
                  errors.github ? 'border-red-500 focus:border-red-500' : ''
                }`}
                required
              />
              {errors.github && (
                <p className="mt-1 text-sm text-red-600">{errors.github}</p>
              )}
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
                className={`w-full ${
                  errors.portfolio ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.portfolio && (
                <p className="mt-1 text-sm text-red-600">{errors.portfolio}</p>
              )}
            </div>
          </div>
        );

      case 2:
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
                  className={`w-full appearance-none rounded-md border bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-1 ${
                    errors.role
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
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
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
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
                  className={`w-full appearance-none rounded-md border bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-1 ${
                    errors.experience_level
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
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
              {errors.experience_level && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.experience_level}
                </p>
              )}
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
                  className={`w-full appearance-none rounded-md border bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-1 ${
                    errors.availability
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
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
              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.availability}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
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
                <span className="ml-2 text-xs text-slate-500">
                  ({formData.motivation.length}/10 min)
                </span>
              </label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) =>
                  handleInputChange('motivation', e.target.value)
                }
                placeholder="Share what motivates you to contribute to this project..."
                className={`min-h-[120px] w-full resize-none ${
                  errors.motivation ? 'border-red-500 focus:border-red-500' : ''
                }`}
                required
              />
              {errors.motivation && (
                <p className="mt-1 text-sm text-red-600">{errors.motivation}</p>
              )}
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
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {showSuccess ? 'Application Submitted' : 'Apply to Project'}
          </DialogTitle>

          {/* Progress bar - only show when not in success state */}
          {!showSuccess && (
            <>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Step {currentStep} of 3
                  </span>
                  <span className="text-sm text-slate-500">
                    {Math.round((currentStep / 3) * 100)}% Complete
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step indicators */}
              <div className="mt-4 flex justify-between">
                {[1, 2, 3].map((step) => (
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
            </>
          )}
        </DialogHeader>

        <div className="py-6">
          {showSuccess ? (
            // Success Message
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="size-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Application Submitted Successfully!
              </h3>
              <p className="mb-4 text-slate-600">
                Thank you for your interest in joining this project. We&apos;ve
                received your application and will review it shortly.
              </p>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <p className="mb-1 font-medium">What&apos;s Next?</p>
                <p>
                  The project owner will review your application and contact you
                  via email if you&apos;re selected to join the team.
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  setCurrentStep(1);
                  setFormData({
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
                  setErrors({});
                  onClose();
                }}
                className="mt-6 bg-green-600 text-white hover:bg-green-700"
              >
                Done
              </Button>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Navigation buttons */}
        {!showSuccess && (
          <div className="flex justify-between border-t border-slate-200 pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6"
            >
              Previous
            </Button>

            {currentStep === 3 ? (
              <Button
                onClick={() => {
                  console.log('Submit button clicked!');
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
