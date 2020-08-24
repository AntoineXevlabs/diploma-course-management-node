import {UserFormModel} from './user-form.model';

export interface TeacherUserModel extends UserFormModel{
    uid: string;
    photoURL: string;
}

