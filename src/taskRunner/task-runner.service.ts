import * as admin from 'firebase-admin';
import {EventModel} from '../core/models/event.model';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {TeacherUserModel} from '../core/models/users/teacher-user.model';
import {mailingService} from '../mailing/mailing.service';
import {SheetStatusEnum} from '../core/enums/sheetStatus.enum';
import {SheetModel} from '../core/models/sheet.model';
import QuerySnapshot = FirebaseFirestore.QuerySnapshot;

const eventDailyMailTemplateId = 'event_reminder_email';
const transcriptReminderTemplateId = 'transcript_reminder_email';

export const taskRunnerService = {
    processEventsForTomorrow(): Promise<void> {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return admin.firestore().collection('events')
            .where('startDate', '>=', tomorrow.getTime())
            .where('startDate', '<=', tomorrow.getTime() + 8.64e+7)
            .get()
            .then(events => {
                events.forEach(eventSnapshot =>
                    taskRunnerService.processTomorrowEvent(eventSnapshot.data() as EventModel)
                );
            });
    },
    processTomorrowEvent(event: EventModel) {
        return admin.firestore().collection('users').where('uid', 'in', event.recorder).get()
            .then((userSnapshots: QuerySnapshot) => {
                userSnapshots.forEach((userSnapshot: DocumentSnapshot) => {
                    const user = userSnapshot.data() as TeacherUserModel;
                    const eventDate = new Date(event.startDate);
                    const messageData = {
                        course: event.course,
                        university: event.university,
                        localisation: event.location,
                        buttonUrl: 'https://fiches.diploma-sante.fr/record/' + event.id,
                        time: eventDate.getUTCHours() + 'h' + eventDate.getMinutes()
                    };
                    return mailingService.sendMail(eventDailyMailTemplateId, [user.email], messageData);
                });
            })
            .catch((error: Error) => {
                console.error(error.name);
                console.error(error.message);
            });
    },
    getTranscriptsToRemind() {
        const date = new Date().getTime();
        return admin.firestore().collection('sheets')
            .where('updatedAt', '>=', date - 3.6e+6 - 8.64e+7)
            .where('updatedAt', '<=', date - 8.64e+7)
            .where('status', '==', SheetStatusEnum.RECORDED)
            .get()
            .then(sheets => {
                sheets.forEach(sheetSnapshot => {
                        const sheet: SheetModel = sheetSnapshot.data() as SheetModel;
                        return taskRunnerService.processReminderMail(sheet.transcripter, transcriptReminderTemplateId, sheet);
                    }
                );
            });
    },
    processReminderMail(userIds: string[], mailId: string, sheet: SheetModel) {
        return admin.firestore().collection('users').where('uid', 'in', userIds).get()
            .then((userSnapshots: QuerySnapshot) => {
                userSnapshots.forEach((userSnapshot: DocumentSnapshot) => {
                    const user = userSnapshot.data() as TeacherUserModel;
                    const messageData = {
                        course: sheet.course,
                        university: sheet.university,
                        chapter: sheet.chapter,
                        buttonUrl: 'https://fiches.diploma-sante.fr/sheet/' + sheet.id,
                    };
                    return mailingService.sendMail(eventDailyMailTemplateId, [user.email], messageData);
                });
            })
            .catch((error: Error) => {
                console.error(error.name);
                console.error(error.message);
            });
    },
    processHourlyTasks() {
        return taskRunnerService.getTranscriptsToRemind();
    }
};

