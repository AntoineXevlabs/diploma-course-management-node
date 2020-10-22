import {Change} from 'firebase-functions';
import {QueryDocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {sheetService} from '../sheets/sheet.service';
import {EventModel} from '../core/models/event.model';

export const onEventUpdated = (snapshot: Change<QueryDocumentSnapshot>, context: any) => {
    const oldEvent = snapshot.before.data() as EventModel;
    const newEvent = snapshot.after.data() as EventModel;
    if (
        oldEvent.course !== newEvent.course ||
        oldEvent.chapter !== newEvent.chapter ||
        oldEvent.university !== newEvent.university ||
        oldEvent.startDate !== newEvent.startDate ||
        oldEvent.endDate !== newEvent.endDate ||
        oldEvent.relatedFiles !== newEvent.relatedFiles ||
        oldEvent.recorder !== newEvent.recorder ||
        oldEvent.transcripter !== newEvent.transcripter ||
        oldEvent.teacher !== newEvent.teacher ||
        oldEvent.sheetMaker !== newEvent.sheetMaker ||
        oldEvent.onlineCourse !== newEvent.onlineCourse ||
        oldEvent.courseLink !== newEvent.courseLink
    ) {
        sheetService.updateSheetsFromEvent(newEvent);
    }
}
