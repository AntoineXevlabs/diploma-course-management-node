import {RolesEnum} from '../../enums/roles.enum';

export interface UserFormModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: RolesEnum;
}
