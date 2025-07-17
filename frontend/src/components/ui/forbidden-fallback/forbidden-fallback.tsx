import * as React from 'react';

import { paths } from '@/config/paths';
import { ROLES } from '@/lib/roles';
import { cn } from '@/utils/cn';

export type ForbiddenFallbackProps = React.HTMLAttributes<HTMLDivElement> & {
  roles?: ROLES[];
  title?: string;
  customMessage?: string;
  returnPath?: string;
  returnText?: string;
};

const ForbiddenFallback = React.forwardRef<
  HTMLDivElement,
  ForbiddenFallbackProps
>(
  (
    {
      className,
      roles = [],
      title = 'Access Denied',
      customMessage,
      returnPath = paths.home.getHref(),
      returnText = 'Go back to home',
      ...props
    },
    ref,
  ) => {
    const formatRoles = (roles: ROLES[]) => {
      if (roles.length === 0) return 'authorized users';
      if (roles.length === 1) return roles[0].toLowerCase() + 's';
      if (roles.length === 2)
        return roles.map((r) => r.toLowerCase() + 's').join(' and ');

      const lastRole = roles[roles.length - 1];
      const otherRoles = roles.slice(0, -1);
      return (
        otherRoles.map((r) => r.toLowerCase() + 's').join(', ') +
        ', and ' +
        lastRole.toLowerCase() +
        's'
      );
    };

    const defaultMessage = `This area is only accessible to ${formatRoles(roles)}.`;

    return (
      <div
        ref={ref}
        className={cn('flex h-screen items-center justify-center', className)}
        {...props}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">
            {customMessage || defaultMessage}
          </p>
          <p className="mt-4">
            <a
              href={returnPath}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {returnText}
            </a>
          </p>
        </div>
      </div>
    );
  },
);

ForbiddenFallback.displayName = 'ForbiddenFallback';

export { ForbiddenFallback };
