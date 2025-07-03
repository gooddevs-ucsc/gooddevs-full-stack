import { z } from 'zod';

export enum ROLES {
  ADMIN = 'ADMIN',
  SPONSOR = 'SPONSOR',
  VOLUNTEER = 'VOLUNTEER',
  REQUESTER = 'REQUESTER',
}

export type RoleTypes = keyof typeof ROLES;

export const roleSchema = z.enum([
  ROLES.ADMIN,
  ROLES.SPONSOR,
  ROLES.VOLUNTEER,
  ROLES.REQUESTER,
]);
