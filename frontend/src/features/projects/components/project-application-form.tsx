import { ArrowLeft, FileText, Github, Linkedin, User } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, Input, Textarea, Select } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';
import { DEVELOPER_ROLE_OPTIONS } from '@/types/api';

import {
  createApplicationInputSchema,
  useCreateApplication,
} from '../api/create-application';

interface ProjectApplicationFormProps {
  projectId: string;
  projectTitle: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const ProjectApplicationForm = ({
  projectId,
  projectTitle,
  onCancel,
  onSuccess,
}: ProjectApplicationFormProps) => {
  const userQuery = useUser();
  const user = userQuery.data;
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Move all hooks to the top before any conditional returns
  const createApplicationMutation = useCreateApplication({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Application Submitted!',
          message:
            'Your application has been submitted successfully. You will be notified about the status.',
        });
        onSuccess?.();
      },
      onError: (error: any) => {
        let errorMessage = 'Failed to submit application. Please try again.';

        if (error.response?.status === 403) {
          errorMessage =
            'You must be logged in as a volunteer to apply to projects.';
        } else if (error.response?.status === 400) {
          errorMessage =
            error.response?.data?.detail ||
            'Invalid application data. Please check your inputs.';
        } else if (error.response?.status === 404) {
          errorMessage =
            'Project not found or no longer available for applications.';
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        }

        addNotification({
          type: 'error',
          title: 'Application Failed',
          message: errorMessage,
        });
      },
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof createApplicationInputSchema>,
  ) => {
    setIsSubmitting(true);

    try {
      // Clean up empty strings to undefined for optional URL fields
      const applicationData = {
        ...data,
        portfolio_url: data.portfolio_url || undefined,
        linkedin_url: data.linkedin_url || undefined,
        skills: data.skills || undefined,
        // cover_letter is required, so don't convert to undefined
        // github_url is required, so don't convert to undefined
      };

      const result = await createApplicationMutation.mutateAsync({
        projectId,
        data: applicationData,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while user data is being fetched
  if (userQuery.isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
        <div className="flex items-center justify-center">
          <div className="mr-2 size-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-slate-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  // Show error state if user data failed to load
  if (userQuery.isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800">
          Failed to load user information. Please refresh the page.
        </p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800">Please log in to apply for this project.</p>
        <Button
          className="mt-4"
          onClick={() => (window.location.href = paths.auth.login.getHref())}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  if (user.role !== 'VOLUNTEER') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-amber-800">
          Only volunteers can apply to projects. Your current role is:{' '}
          <strong>{user.role}</strong>
        </p>
        <p className="mt-2 text-sm text-amber-700">
          Expected: VOLUNTEER, Got: {user.role} (Type: {typeof user.role})
        </p>
        <Button variant="outline" className="mt-4" onClick={onCancel}>
          Back to Project
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200/60 p-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Project
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
            <FileText className="size-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Apply to Join Project
            </h1>
            <p className="text-slate-600">{projectTitle}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <Form onSubmit={handleSubmit} schema={createApplicationInputSchema}>
          {({ register, formState }) => (
            <div className="space-y-6">
              {/* Role Selection */}
              <Select
                label="What role do you want to play? *"
                options={DEVELOPER_ROLE_OPTIONS}
                registration={register('volunteer_role')}
                error={formState.errors.volunteer_role}
                className="border-2 border-gray-300 bg-white shadow-sm transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-gray-500">
                Choose the role you&apos;re most excited about! For example:
                Frontend Developer, UI/UX Designer, Project Manager, or suggest
                your own.
              </p>

              {/* Experience */}
              <Input
                type="number"
                label="Years of Experience"
                placeholder="e.g., 3"
                registration={register('experience_years', {
                  valueAsNumber: true,
                })}
                error={formState.errors.experience_years}
                min="0"
                max="50"
              />

              {/* Cover Letter */}
              <Textarea
                rows={6}
                label="Cover Letter *"
                placeholder="Tell us why you're interested in this project and what you can contribute..."
                registration={register('cover_letter')}
                error={formState.errors.cover_letter}
              />

              {/* Skills */}
              <Textarea
                rows={4}
                label="Relevant Skills & Technologies"
                placeholder="List your relevant skills, technologies, frameworks, etc."
                registration={register('skills')}
                error={formState.errors.skills}
              />

              {/* URLs Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Portfolio & Social Links
                </h3>
                <p className="text-sm text-slate-600">
                  Share your work and professional profiles
                </p>

                <div className="grid gap-4 md:grid-cols-1">
                  {/* Portfolio URL */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
                      <User className="size-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="url"
                        label="Portfolio Website"
                        placeholder="https://yourportfolio.com"
                        registration={register('portfolio_url')}
                        error={formState.errors.portfolio_url}
                      />
                    </div>
                  </div>

                  {/* GitHub URL */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-100">
                      <Github className="size-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="url"
                        label="GitHub Profile *"
                        placeholder="https://github.com/yourusername"
                        registration={register('github_url')}
                        error={formState.errors.github_url}
                      />
                    </div>
                  </div>

                  {/* LinkedIn URL */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
                      <Linkedin className="size-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="url"
                        label="LinkedIn Profile"
                        placeholder="https://linkedin.com/in/yourusername"
                        registration={register('linkedin_url')}
                        error={formState.errors.linkedin_url}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
                  disabled={isSubmitting || formState.isSubmitting}
                >
                  {isSubmitting || formState.isSubmitting ? (
                    <>
                      <div className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Submitting Application...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};
