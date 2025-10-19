import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';

import { paths } from '@/config/paths';
import { AuthResponse, User } from '@/types/api';

import { api } from './api-client';
import { configureAuth } from './auth-utils';
import { ROLES } from './roles';

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features

const getUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  // Backend returns {data: user}, API interceptor returns response.data
  // From debug info: response.data already contains the user object directly
  return response.data;
};

const logout = (): Promise<void> => {
  return api.post('/auth/logout');
};

export const loginInputSchema = z.object({
  username: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(5, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = (data: LoginInput): Promise<AuthResponse> => {
  // OAuth2PasswordRequestForm expects application/x-www-form-urlencoded with
  // fields named `username` and `password`. Build URLSearchParams so axios
  // sends the proper form body.
  const params = new URLSearchParams();
  params.append('username', data.username);
  params.append('password', data.password);

  return api.post('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const registerInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  firstname: z
    .string()
    .min(1, 'Required')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes',
    ),
  lastname: z
    .string()
    .min(1, 'Required')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes',
    ),
  password: z.string().min(8, 'Should be at least 8 characters'),
  role: z.enum([ROLES.ADMIN, ROLES.SPONSOR, ROLES.VOLUNTEER, ROLES.REQUESTER]),
  volunteer_roles: z.array(z.string()).optional(),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithEmailAndPassword = (
  data: RegisterInput,
): Promise<AuthResponse> => {
  return api.post('/auth/register', data);
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const response = await loginWithEmailAndPassword(data);
    return response.user;
  },
  registerFn: async (data: RegisterInput) => {
    const response = await registerWithEmailAndPassword(data);
    return response.user;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
