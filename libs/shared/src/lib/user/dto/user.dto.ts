import { UserRole } from '../enum/user-role.enum';

export class UserDto {
  _id!: string;
  email!: string;
  role!: UserRole;
  balance!: number;
}
