import { SheetCircuitEnum } from '../enums/sheetCircuit.enum';
import { SheetStatusEnum } from '../enums/sheetStatus.enum';
import { UniversityEnum } from '../enums/university.enum';

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
    previousYearSheet: string;
    circuit: SheetCircuitEnum;
    status: SheetStatusEnum;
    recorder: string; //uid of the recoder
    transcripter: string;
    teacher: string;
    sheetMaker: string;
    recordIds: string[]; //id of the record. Record is type SheetActionModel
    transcriptId: string; //id of the transcript, type SheetActionModel
    mapId: string;
    sheetId: string;
    previousYearSheetReference: string;
}
