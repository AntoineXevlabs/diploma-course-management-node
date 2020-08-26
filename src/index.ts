import * as functions from 'firebase-functions';
import {onUserCreated} from './users/user-creation';
import {onUserDeleted} from './users/user-deletion';
import {onEventCreated} from './event/event-creation';
import {dailyTasks} from './taskRunner/daily.tasks';
import {onSheetCreated} from './sheets/event-creation';

const admin = require('firebase-admin');
admin.initializeApp();

export const onUserCreatedTrigger = functions.firestore.document('users/{user}').onCreate(onUserCreated);
export const onUserDeletedTrigger = functions.firestore.document('users/{user}').onDelete(onUserDeleted);

export const onEventCreatedTrigger = functions.firestore.document('events/{eventId}').onCreate(onEventCreated);

export const onSheetCreatedTrigger = functions.firestore.document('sheets/{sheetId}').onCreate(onSheetCreated);

export const dailyTaskRunner = functions.runWith( { memory: '2GB' })
    .pubsub.schedule('0 19 * * *').timeZone('Europe/Paris').onRun(dailyTasks);
