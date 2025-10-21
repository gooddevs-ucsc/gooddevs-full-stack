import { FC } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, Input, Select, Textarea } from '@/components/ui/form';
import { Task, TaskPriority, TaskStatus } from '@/types/api';

import { useApprovedApplicants } from '../api/get-approved-applicants';

const getVolunteerFullName = (volunteer: {
  firstname?: string;
  lastname?: string;
}) => {
  if (volunteer.firstname && volunteer.lastname)
    return `${volunteer.firstname} ${volunteer.lastname}`;
  return volunteer.firstname || volunteer.lastname || '';
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: Task | null;
  isLoading?: boolean;
  projectId: string;
}

// Input schema - what the form accepts (all strings from HTML inputs)
const taskFormInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority),
  estimated_hours: z.string().optional(),
  due_date: z.string().optional(),
  assignee_id: z.string().optional(),
});

// Define the output type manually
export interface TaskFormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority: TaskPriority;
  estimated_hours?: number;
  due_date?: string;
  assignee_id?: string;
}

const statusOptions = [
  { label: 'To Do', value: TaskStatus.TODO },
  { label: 'In Progress', value: TaskStatus.IN_PROGRESS },
  { label: 'Completed', value: TaskStatus.COMPLETED },
  { label: 'Cancelled', value: TaskStatus.CANCELLED },
];

const priorityOptions = [
  { label: 'Low', value: TaskPriority.LOW },
  { label: 'Medium', value: TaskPriority.MEDIUM },
  { label: 'High', value: TaskPriority.HIGH },
  { label: 'Urgent', value: TaskPriority.URGENT },
];

export const TaskModal: FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading = false,
  projectId,
}) => {
  const isEditing = !!task;
  const { data: approvedApplicantsData, isLoading: isLoadingApplicants } =
    useApprovedApplicants({ projectId });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Transform the form data before submitting
  const handleSubmit = (formData: z.infer<typeof taskFormInputSchema>) => {
    const transformedData: TaskFormData = {
      ...formData,
      estimated_hours:
        formData.estimated_hours && formData.estimated_hours !== ''
          ? Number(formData.estimated_hours)
          : undefined,
      assignee_id: formData.assignee_id || undefined,
    };

    // Validate the transformed data
    if (transformedData.estimated_hours !== undefined) {
      if (
        isNaN(transformedData.estimated_hours) ||
        transformedData.estimated_hours < 0
      ) {
        return;
      }
    }

    onSubmit(transformedData);
  };

  // Default values that match the INPUT schema (all strings)
  const getDefaultValues = (): z.infer<typeof taskFormInputSchema> => {
    const baseValues = {
      title: '',
      description: '',
      status: TaskStatus.TODO as TaskStatus,
      priority: TaskPriority.MEDIUM as TaskPriority,
      estimated_hours: '',
      due_date: '',
      assignee_id: '',
    };

    if (task) {
      return {
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        estimated_hours: task.estimated_hours?.toString() || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        assignee_id: task.assignee_id || '',
      };
    }

    return baseValues;
  };

  // Create volunteer options for the dropdown
  const approvedApplicantOptions =
    approvedApplicantsData?.data?.map((applicant) => ({
      label: `${getVolunteerFullName(applicant)}`,
      value: applicant.id,
    })) || [];

  // Add "Select Assignee" option at the beginning
  const assigneeOptions = [
    { label: '- Select Assignee -', value: '' },
    ...approvedApplicantOptions,
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Form
            onSubmit={handleSubmit}
            schema={taskFormInputSchema}
            options={{
              defaultValues: getDefaultValues(),
            }}
            key={isOpen ? (task ? task.id : 'new') : 'closed'}
          >
            {({ register, formState }) => (
              <div className="space-y-6">
                {/* Title */}
                <Input
                  label="Task Title *"
                  placeholder="Enter task title"
                  registration={register('title')}
                  error={formState.errors.title}
                />

                {/* Description */}
                <Textarea
                  label="Description"
                  placeholder="Describe the task..."
                  rows={4}
                  registration={register('description')}
                  error={formState.errors.description}
                />

                {/* Form Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Status */}
                  {isEditing && (
                    <Select
                      label="Status"
                      options={statusOptions}
                      registration={register('status')}
                      error={formState.errors.status}
                    />
                  )}

                  {/* Priority */}
                  <Select
                    label="Priority *"
                    options={priorityOptions}
                    registration={register('priority')}
                    error={formState.errors.priority}
                  />

                  {/* Assignee */}
                  <Select
                    label="Assign to Approved Applicant"
                    options={assigneeOptions}
                    registration={register('assignee_id')}
                    error={formState.errors.assignee_id}
                    disabled={isLoadingApplicants}
                  />

                  {/* Estimated Hours */}
                  <Input
                    type="number"
                    label="Estimated Hours"
                    placeholder="1"
                    min="1"
                    step="1"
                    registration={register('estimated_hours')}
                    error={formState.errors.estimated_hours}
                  />

                  {/* Due Date */}
                  <Input
                    type="date"
                    label="Due Date"
                    min={getTodayDate()}
                    registration={register('due_date')}
                    error={formState.errors.due_date}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isEditing ? 'Update Task' : 'Create Task'}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
