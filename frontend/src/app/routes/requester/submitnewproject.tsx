import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Form, Input, Select, Textarea } from '@/components/ui/form';
import { paths } from '@/config/paths';

// Form validation schema
const submitProjectSchema = z.object({
  title: z.string().min(3, 'Project title must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  timeline: z.string().min(1, 'Please select a timeline'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

type SubmitProjectFormData = z.infer<typeof submitProjectSchema>;

const SubmitNewProject = () => {
  const navigate = useNavigate();

  // Category options with placeholder
  const categoryOptions = [
    { label: 'Select a category...', value: '' },
    { label: 'Website Development', value: 'website' },
    { label: 'Mobile App', value: 'mobile' },
    { label: 'Data Analysis', value: 'data' },
    { label: 'UI/UX Design', value: 'uiux' },
    { label: 'API Development', value: 'api' },
    { label: 'Database Design', value: 'database' },
    { label: 'Desktop Application', value: 'desktop' },
    { label: 'Other', value: 'other' },
  ];

  // Timeline options with placeholder
  const timelineOptions = [
    { label: 'Select timeline...', value: '' },
    { label: '1-2 Weeks', value: '1-2weeks' },
    { label: '1 Month', value: '1month' },
    { label: '3 Months', value: '3months' },
    { label: '6 Months', value: '6months' },
    { label: 'Flexible', value: 'flexible' },
  ];

  const handleSubmit = async (data: SubmitProjectFormData) => {
    try {
      // Simulate API call
      console.log('Submitting project:', data);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate back to projects page on success
      navigate(paths.requester.projects.getHref());
    } catch (error) {
      console.error('Error submitting project:', error);
      // Handle error (show toast, etc.)
    }
  };

  const handleCancel = () => {
    navigate(paths.requester.projects.getHref());
  };

  return (
    <ContentLayout title="Submit New Project">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Projects
          </Button>
        </div>

        {/* Main Form Card */}
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
                  Provide details about your project to find the right
                  developers
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Form onSubmit={handleSubmit} schema={submitProjectSchema}>
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
                      label="Category *"
                      options={categoryOptions}
                      registration={register('category')}
                      error={formState.errors.category}
                    />

                    {/* Timeline */}
                    <Select
                      label="Timeline *"
                      options={timelineOptions}
                      registration={register('timeline')}
                      error={formState.errors.timeline}
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
                          <li>
                            • Provide examples of similar projects if helpful
                          </li>
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
                      disabled={formState.isSubmitting}
                    >
                      {formState.isSubmitting ? (
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
      </div>
    </ContentLayout>
  );
};

export default SubmitNewProject;
