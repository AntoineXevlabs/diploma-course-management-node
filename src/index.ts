import * as functions from 'firebase-functions';
import {onUserCreated} from './users/user-creation';
import {onUserDeleted} from './users/user-deletion';

const admin = require('firebase-admin');
admin.initializeApp();

export const onUserCreatedTrigger = functions.firestore.document('users/{user}').onCreate(onUserCreated);
export const onUserDeletedTrigger = functions.firestore.document('users/{user}').onDelete(onUserDeleted);
