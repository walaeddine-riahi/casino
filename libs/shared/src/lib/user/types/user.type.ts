import { UserRole } from '../enum/user-role.enum';

export type User = {
  _id: string;
  email: string;
  password: string;
  role: UserRole;
  balance: number;
};
