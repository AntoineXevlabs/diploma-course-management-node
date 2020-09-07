import * as admin from 'firebase-admin';
import {EventModel} from '../core/models/event.model';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {TeacherUserModel} from '../core/models/users/teacher-user.model';
import {mailingService} from '../mailing/mailing.service';
import {SheetStatusEnum} from '../core/enums/sheetStatus.enum';
import {SheetModel} from '../core/models/sheet.model';

const eventDailyMailTemplateId = 'd-0ea3988469fa49dca5e20776eb7fef62';
const transcriptReminderTemplateId = 'd-1005f7689d674ae99bb42f49b38ec90a';

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
        return admin.firestore().collection('users').doc(event.recorder).get()
            .then((userSnapshot: DocumentSnapshot) => {
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
    processReminderMail(userId: string, mailId: string, sheet: SheetModel) {
        return admin.firestore().collection('users').doc(userId).get()
            .then((userSnapshot: DocumentSnapshot) => {
                const user = userSnapshot.data() as TeacherUserModel;
                const messageData = {
                    course: sheet.course,
                    university: sheet.university,
                    chapter: sheet.chapter,
                    buttonUrl: 'https://fiches.diploma-sante.fr/sheet/' + sheet.id,
                };
                return mailingService.sendMail(eventDailyMailTemplateId, [user.email], messageData);
            })
            .catch((error: Error) => {
                console.error(error.name);
                console.error(error.message);
            });
    },
    processHourlyTasks() {
        return taskRunnerService.getTranscriptsToRemind()
    }
};

