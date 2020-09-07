import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {TeacherUserModel} from '../core/models/users/teacher-user.model';
import {mailingService} from '../mailing/mailing.service';
import {SheetModel} from '../core/models/sheet.model';
import {SheetCircuitEnum} from '../core/enums/sheetCircuit.enum';
import {of} from 'rxjs';
import {SheetStatusEnum} from '../core/enums/sheetStatus.enum';
import QuerySnapshot = FirebaseFirestore.QuerySnapshot;

const transcriptCreationMailTemplateId = 'd-e33a5662d23849a5a26248d468c4b5e8';
const newSheetRedactionMailTemplateId = 'd-779d6849e9be4d0eb9a1aa261b2350e3';
const newMapMailTemplateId = 'd-894432e776e544fa87d7ffe2aa1da1fe';
const newSheetToValidateTemplateId = 'd-0718eabd6d254f8297992941c5b0819a';

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
        console.log(JSON.stringify(oldSheet))
        console.log(JSON.stringify(newSheet))
        if (oldSheet.status !== SheetStatusEnum.TRANSCRIPTED && newSheet.status === SheetStatusEnum.TRANSCRIPTED) {
           return sendSheetNotificationMail(newMapMailTemplateId, newSheet.teacher, newSheet)
        } else if (oldSheet.status !== SheetStatusEnum.MAPPED && newSheet.status === SheetStatusEnum.MAPPED) {
            return sendSheetNotificationMail(newSheetRedactionMailTemplateId, newSheet.sheetMaker, newSheet)
        } else if (oldSheet.status !== SheetStatusEnum.SHEET_DONE && newSheet.status === SheetStatusEnum.SHEET_DONE) {
            return sendSheetNotificationMail(newSheetToValidateTemplateId, newSheet.teacher, newSheet)
        }
        return of();
    }
};
