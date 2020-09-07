import { SheetCircuitEnum } from '../enums/sheetCircuit.enum';
import { SheetStatusEnum } from '../enums/sheetStatus.enum';
import { UniversityEnum } from '../enums/university.enum';
import {FileModel} from './file.model';

export interface SheetModel {
    id: string;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    course: string;
    chapter: string;
    university: UniversityEnum;
    finished: boolean;
    relatedEventsIds: string[];
    circuit: SheetCircuitEnum;
    status: SheetStatusEnum;
    relatedFiles: FileModel[];
    recorder: string[]; //uid of the recoder
    transcripter: string[];
    teacher: string[];
    onlineCourse: boolean;
    courseLink: string;
    sheetMaker: string[];
    recordIds: string[]; //id of the record. Record is type SheetActionModel
    transcriptId: string; //id of the transcript, type SheetActionModel
    mapId: string;
    sheetId: string;
}
