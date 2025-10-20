import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEVELOPER_ROLE_OPTIONS, OpenPosition } from '@/types/api';

import { useCreateOpenPosition } from '../api/create-open-position';
import { useUpdateOpenPosition } from '../api/update-open-position';

const openPositionSchema = z.object({
  volunteer_role: z.enum([
    'FRONTEND',
    'BACKEND',
    'FULLSTACK',
    'UIUX',
    'MOBILE',
    'DEVOPS',
    'QA',
    'PM',
  ]),
  openings_count: z.number().min(1).max(10),
  description: z.string().optional(),
});

type FormData = z.infer<typeof openPositionSchema>;

interface OpenPositionFormProps {
  projectId: string;
  position?: OpenPosition | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const OpenPositionForm = ({
  projectId,
  position,
  onSuccess,
  onCancel,
}: OpenPositionFormProps) => {
  const createMutation = useCreateOpenPosition();
  const updateMutation = useUpdateOpenPosition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(openPositionSchema),
    defaultValues: {
      volunteer_role: position?.volunteer_role || 'FRONTEND',
      openings_count: position?.openings_count || 1,
      description: position?.description || '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (position) {
      updateMutation.mutate(
        {
          positionId: position.id,
          data: {
            openings_count: data.openings_count,
            description: data.description,
          },
        },
        {
          onSuccess,
        },
      );
    } else {
      createMutation.mutate(
        {
          projectId,
          data,
        },
        {
          onSuccess,
        },
      );
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">
        {position ? 'Edit Open Position' : 'Add Open Position'}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="volunteer_role"
            className="text-sm font-medium text-slate-700"
          >
            Role
          </label>
          <select
            id="volunteer_role"
            disabled={!!position} // Can't change role when editing
            {...register('volunteer_role')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {DEVELOPER_ROLE_OPTIONS.filter((option) => option.value).map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </select>
          {errors.volunteer_role && (
            <p className="text-sm text-red-600">
              {errors.volunteer_role.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="openings_count"
            className="text-sm font-medium text-slate-700"
          >
            Number of Openings
          </label>
          <Input
            id="openings_count"
            type="number"
            min="1"
            max="10"
            {...register('openings_count', { valueAsNumber: true })}
          />
          {errors.openings_count && (
            <p className="text-sm text-red-600">
              {errors.openings_count.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            rows={3}
            placeholder="Brief description of the role requirements..."
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading
              ? 'Saving...'
              : position
                ? 'Update Position'
                : 'Add Position'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
