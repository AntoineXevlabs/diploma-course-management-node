import { EventStatusEnum } from '../enums/eventStatus.enum';
import { UniversityEnum } from '../enums/university.enum';

export interface EventModel extends EventFormModel {
    id: string;
    createdAt: number;
    updatedAt: number;
    createdBy: string; // uid
}

export interface EventFormModel {
    course: string;
    chapter: string;
    university: UniversityEnum;
    location: string;
    startDate: number;
    endDate: number;
    recorder: string; // uid of the recoder
    transcripter: string;
    teacher: string;
    sheetMaker: string;
    previousYearSheet: string; // storage of the previous year sheet
    onlineCourse: boolean;
    courseLink: string;
    status: EventStatusEnum;
}
