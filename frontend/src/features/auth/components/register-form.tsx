import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Input, Label } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { registerInputSchema, useRegister } from '@/lib/auth';

type RegisterFormProps = {
  onSuccess: () => void;
  onError?: (error: unknown) => void;
};

// Development roles options
const developmentRoles = [
  { id: 'frontend', label: 'Frontend Developer', value: 'FRONTEND' },
  { id: 'backend', label: 'Backend Developer', value: 'BACKEND' },
  { id: 'fullstack', label: 'Full-Stack Developer', value: 'FULLSTACK' },
  { id: 'uiux', label: 'UI/UX Designer', value: 'UIUX' },
  { id: 'projectmanager', label: 'Project Manager', value: 'PROJECTMANAGER' },
  { id: 'qa', label: 'QA Engineer', value: 'QA' },
];

// Role options for radio buttons
const roleOptions = [
  {
    label: 'Volunteer',
    value: 'VOLUNTEER',
    description: 'Join as a developer volunteer',
  },
  {
    label: 'Requester',
    value: 'REQUESTER',
    description: 'Post projects and find developers',
  },
  {
    label: 'Sponsor',
    value: 'SPONSOR',
    description: 'Support projects financially',
  },
];

export const RegisterForm = ({ onSuccess, onError }: RegisterFormProps) => {
  const registering = useRegister({
    onSuccess,
    onError: (error) => {
      onError?.(error);
    },
  });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  // State for tracking selected role
  const [selectedRole, setSelectedRole] = useState<string>('');

  // State for tracking selected development roles
  const [selectedDevRoles, setSelectedDevRoles] = useState<string[]>([]);

  // Handler for development role checkboxes
  const handleDevRoleChange = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevRoles((prev) => [...prev, roleId]);
    } else {
      setSelectedDevRoles((prev) => prev.filter((id) => id !== roleId));
    }
  };

  return (
    <div>
      <Form
        onSubmit={(values) => {
          // You can access selectedDevRoles here if needed for future backend integration
          const submissionData = {
            ...values,
            volunteer_roles: selectedDevRoles,
          };
          registering.mutate(submissionData);
        }}
        schema={registerInputSchema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register, formState, watch }) => {
          // Watch the role value to trigger re-rendering
          const currentRole = watch('role');

          // Update selectedRole when form value changes
          if (currentRole !== selectedRole) {
            setSelectedRole(currentRole || '');
            // Clear development roles if switching away from volunteer
            if (currentRole !== 'VOLUNTEER') {
              setSelectedDevRoles([]);
            }
          }

          return (
            <>
              <Input
                type="text"
                label="First Name"
                error={formState.errors['firstname']}
                registration={register('firstname')}
              />
              <Input
                type="text"
                label="Last Name"
                error={formState.errors['lastname']}
                registration={register('lastname')}
              />
              <Input
                type="email"
                label="Email Address"
                error={formState.errors['email']}
                registration={register('email')}
              />
              <Input
                type="password"
                label="Password"
                error={formState.errors['password']}
                registration={register('password')}
              />

              {/* Role Selection with Radio Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">
                  Role *
                </Label>

                <div className="space-y-3">
                  {roleOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-start space-x-3"
                    >
                      <input
                        type="radio"
                        id={`role-${option.value}`}
                        value={option.value}
                        {...register('role')}
                        className="mt-1 size-4 border-slate-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`role-${option.value}`}
                          className="cursor-pointer text-sm font-medium text-slate-900"
                        >
                          {option.label}
                        </label>
                        <p className="mt-1 text-xs text-slate-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Error display */}
                {formState.errors['role'] && (
                  <p className="text-sm text-red-600">
                    {formState.errors['role'].message}
                  </p>
                )}
              </div>

              {/* Conditional Development Roles Section */}
              {currentRole === 'VOLUNTEER' && (
                <div className="space-y-4">
                  <div>
                    <Label>What role(s) are you interested in?</Label>
                    <p className="mt-1 text-xs text-slate-600">
                      Select one or more development roles that match your
                      skills and interests.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {developmentRoles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="checkbox"
                          id={`dev-role-${role.id}`}
                          checked={selectedDevRoles.includes(role.id)}
                          onChange={(e) =>
                            handleDevRoleChange(role.id, e.target.checked)
                          }
                          className="size-4 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        />
                        <label
                          htmlFor={`dev-role-${role.id}`}
                          className="cursor-pointer text-sm font-medium text-slate-700"
                        >
                          {role.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Optional: Show selected roles count */}
                  {selectedDevRoles.length > 0 && (
                    <p className="text-xs text-slate-500">
                      {selectedDevRoles.length} role
                      {selectedDevRoles.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              )}

              <div>
                <Button
                  isLoading={registering.isPending}
                  type="submit"
                  className="w-full"
                >
                  Register
                </Button>
              </div>
            </>
          );
        }}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to={paths.auth.login.getHref(redirectTo)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
