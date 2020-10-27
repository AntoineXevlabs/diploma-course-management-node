import {Change} from 'firebase-functions';
import {QueryDocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {sheetService} from '../sheets/sheet.service';
import {EventModel} from '../core/models/event.model';
import _ = require('lodash');

export const onEventUpdated = (snapshot: Change<QueryDocumentSnapshot>, context: any) => {
    const oldEvent = snapshot.before.data() as EventModel;
    const newEvent = snapshot.after.data() as EventModel;
    if (_.isEqual(_.omit(oldEvent, ['id', 'createdAt', 'updatedAt', 'createdBy', 'location', 'previousYearSheet', 'status']),
        _.omit(newEvent, ['id', 'createdAt', 'updatedAt', 'createdBy', 'location', 'previousYearSheet', 'status']))
    ) {
        sheetService.updateSheetsFromEvent(newEvent);
    }
}
