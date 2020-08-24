import { FileModel } from './file.model';

export interface RecordFormModel {
    diapoFile: FileModel;
    recordFile: FileModel;
    sheets: {
        course: RecordSheetModel
        finished: boolean
    }[];
}

export interface RecordSheetModel {
    course: string;
    id: string;
    recordIds: string[];
    relatedEventsIds: string[];
}
