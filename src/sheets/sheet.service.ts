import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {TeacherUserModel} from '../core/models/users/teacher-user.model';
import {mailingService} from '../mailing/mailing.service';
import {SheetModel} from '../core/models/sheet.model';
import {SheetCircuitEnum} from '../core/enums/sheetCircuit.enum';
import {of} from 'rxjs';
import {SheetStatusEnum} from '../core/enums/sheetStatus.enum';
import QuerySnapshot = FirebaseFirestore.QuerySnapshot;
import {EventModel} from '../core/models/event.model';

const transcriptCreationMailTemplateId = 'transcription_creation_email';
const newSheetRedactionMailTemplateId = 'sheet_creation_email';
const newMapMailTemplateId = 'map_creation_email';
const newSheetToValidateTemplateId = 'validation_creation_email';

const sendSheetNotificationMail = (mailId: string, userIds: string[], sheet:SheetModel) => {
    return admin.firestore().collection('users').where('uid', 'in', userIds).get()
        .then((userSnapshots: QuerySnapshot) => {
            userSnapshots.forEach((userSnapshot: DocumentSnapshot) => {
                const user = userSnapshot.data() as TeacherUserModel;
                const messageData = {
                    course: sheet.course,
                    chapter: sheet.chapter,
                    buttonUrl: 'https://fiches.diploma-sante.fr/sheets/' + sheet.id
                };
                return mailingService.sendMail(mailId, [user.email], messageData);
            })

        })
        .catch((error: Error) => {
            console.error(error.name);
            console.error(error.message);
        });
}


export const sheetService = {
    processSheetCreated(sheet: SheetModel) {
        if (sheet.finished) {
            switch (sheet.circuit) {
                case SheetCircuitEnum.LONG:
                    return sendSheetNotificationMail(transcriptCreationMailTemplateId, sheet.transcripter, sheet)
                case SheetCircuitEnum.SHORT:
                    return sendSheetNotificationMail(newSheetRedactionMailTemplateId, sheet.sheetMaker, sheet)
            }

        }
        return of();
    },
    processSheetUpdated(oldSheet: SheetModel, newSheet: SheetModel) {
        if (oldSheet.status !== SheetStatusEnum.TRANSCRIPTED && newSheet.status === SheetStatusEnum.TRANSCRIPTED) {
           return sendSheetNotificationMail(newMapMailTemplateId, newSheet.teacher, newSheet)
        } else if (oldSheet.status !== SheetStatusEnum.MAPPED && newSheet.status === SheetStatusEnum.MAPPED) {
            return sendSheetNotificationMail(newSheetRedactionMailTemplateId, newSheet.sheetMaker, newSheet)
        } else if (oldSheet.status !== SheetStatusEnum.SHEET_DONE && newSheet.status === SheetStatusEnum.SHEET_DONE) {
            return sendSheetNotificationMail(newSheetToValidateTemplateId, newSheet.teacher, newSheet)
        }
        return of();
    },
    updateSheetsFromEvent(event: EventModel) {
        admin.firestore().collection('sheets').where('relatedEventsIds', 'array-contains', event.id).get()
            .then((sheetsSnapshot: QuerySnapshot) => {
                return sheetsSnapshot.forEach((sheetSnapshot: DocumentSnapshot) => {
                    admin.firestore().collection('sheets').doc(sheetSnapshot.id).update({
                    course: event.course,
                    chapter: event.chapter,
                    university: event.university,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    relatedFiles: event.relatedFiles,
                    recorder: event.recorder,
                    transcripter: event.transcripter,
                    teacher: event.teacher,
                    sheetMaker: event.sheetMaker,
                    onlineCourse: event.onlineCourse,
                    courseLink: event.courseLink})
                })
            }).catch((error) => console.log(error))
    }
};
