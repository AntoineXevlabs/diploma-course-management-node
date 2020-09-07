import { FileTypeEnum } from '../enums/fileType.enum';

export interface FileModel {
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  fileId?: string;
  path?: string;
  downloadUrl?: string;
  type: FileTypeEnum;
  storageRef?: string;
}
