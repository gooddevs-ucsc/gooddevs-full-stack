import { useNavigate, useSearchParams } from 'react-router';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { LoginForm } from '@/features/auth/components/login-form';

const LoginRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const { addNotification } = useNotifications();

  return (
    <AuthLayout title="Log in to your account">
      <LoginForm
        onSuccess={() => {
          navigate(`${redirectTo ? `${redirectTo}` : paths.home.getHref()}`, {
            replace: true,
          });
        }}
        onError={(error) => {
          addNotification({
            type: 'error',
            title:
              (error as any)?.response?.data?.detail ||
              (error as any)?.message ||
              'Unknown error',
          });
        }}
      />
    </AuthLayout>
  );
};

export default LoginRoute;
