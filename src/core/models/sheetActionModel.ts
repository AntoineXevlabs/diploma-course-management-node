import { ActionTypeEnum } from '../enums/actionTypeEnum';
import { FileModel } from './file.model';

export interface SheetActionModel {
    id: string;
    createdAt: number;
    createdBy: string;
    updatedAt: number;
    files: FileModel[];
    validated: boolean;
    relatedEvent?: string;
    type: ActionTypeEnum;
}
