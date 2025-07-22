import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Input, Select, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ESTIMATED_TIMELINE_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/types/api';

import {
  useCreateProject,
  createProjectInputSchema,
  type CreateProjectInput,
} from '../api/create-project';

export const ProjectCreateForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const createProjectMutation = useCreateProject({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Project Submitted',
          message: 'Your project request has been submitted successfully.',
        });
        navigate(paths.requester.projects.getHref());
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Submission Failed',
          message: 'Failed to submit project. Please try again.',
        });
      },
    },
  });

  const handleSubmit = async (data: CreateProjectInput) => {
    const projectData = {
      title: data.title,
      description: data.description,
      project_type: data.project_type,
      estimated_timeline: data.estimated_timeline,
      preferred_technologies: data.preferred_technologies || undefined,
    };

    createProjectMutation.mutate({ data: projectData });
  };

  const handleCancel = () => {
    navigate(paths.requester.projects.getHref());
  };

  return (
    <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
      <div className="border-b border-slate-200/60 p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              New Project Request
            </h1>
            <p className="text-slate-600">
              Provide details about your project to find the right developers
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Form onSubmit={handleSubmit} schema={createProjectInputSchema}>
          {({ register, formState }) => (
            <div className="space-y-6">
              {/* Project Title */}
              <Input
                type="text"
                label="Project Title *"
                placeholder="Enter project title"
                registration={register('title')}
                error={formState.errors.title}
              />

              {/* Form Grid - Category and Timeline */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Category */}
                <Select
                  label="Project Type *"
                  options={PROJECT_TYPE_OPTIONS}
                  registration={register('project_type')}
                  error={formState.errors.project_type}
                />

                {/* Timeline */}
                <Select
                  label="Timeline"
                  options={ESTIMATED_TIMELINE_OPTIONS}
                  registration={register('estimated_timeline')}
                  error={formState.errors.estimated_timeline}
                />
              </div>

              {/* Project Description */}
              <Textarea
                rows={6}
                label="Project Description *"
                placeholder="Describe your project requirements..."
                registration={register('description')}
                error={formState.errors.description}
              />

              {/* Preferred Technologies */}
              <Input
                type="text"
                label="Preferred Technologies (Optional)"
                placeholder="e.g., React, Python, Node.js, PostgreSQL"
                registration={register('preferred_technologies')}
                error={formState.errors.preferred_technologies}
              />

              {/* Help Text */}
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="size-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">
                      Tips for a great project description:
                    </h3>
                    <ul className="mt-2 space-y-1 text-sm text-blue-800">
                      <li>• Be specific about what you need</li>
                      <li>
                        • Include any technical requirements or preferences
                      </li>
                      <li>• Mention your target audience and goals</li>
                      <li>• Provide examples of similar projects if helpful</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary/90 sm:w-auto"
                  disabled={
                    formState.isSubmitting || createProjectMutation.isPending
                  }
                >
                  {formState.isSubmitting || createProjectMutation.isPending ? (
                    <>
                      <div className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Project Request'
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
