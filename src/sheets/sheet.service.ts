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
import {Request} from 'firebase-functions/lib/providers/https';
import * as express from 'express';

const transcriptCreationMailTemplateId = 'transcription_creation_email';
const newSheetRedactionMailTemplateId = 'sheet_creation_email';
const newMapMailTemplateId = 'map_creation_email';
const newSheetToValidateTemplateId = 'validation_creation_email';
const cors = require('cors')({
    origin: true
});

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
    }
};

export const addEventStartAndEndDates = (req: Request, res: express.Response): Promise<void> => {
    return cors(req, res, () => {
        return admin.firestore().collection('sheets').get()
            .then((sheetSnapshots: QuerySnapshot) => {
                sheetSnapshots.forEach((sheetSnapshot: DocumentSnapshot) => {
                    const sheet = sheetSnapshot.data() as SheetModel;
                    if (!sheet.eventStartDate) {
                        admin.firestore().collection('events').where('id', '==', sheet.relatedEventsIds[0]).limit(1).get()
                            .then((eventSnapshots: QuerySnapshot) => {
                                if (eventSnapshots.docs.length > 0) {
                                    const relatedEvent = eventSnapshots.docs[0].data() as EventModel;
                                    admin.firestore().collection('sheets').doc(sheet.id).update({
                                        eventStartDate: relatedEvent.startDate,
                                        eventEndDate: relatedEvent.endDate
                                    });
                                }
                            }).catch((error) => {res.status(503).send({error: JSON.stringify(error)})});
                    }
                });
            }).catch((error) => {res.status(503).send({error: JSON.stringify(error)})});
    });
}

export const temp2 = (req: Request, res: express.Response): Promise<void> => {
    let promises: Promise<any>[] = [];
    promises.push(admin.firestore().collection('sheets').get()
        .then((sheetSnapshots: QuerySnapshot) => {
            sheetSnapshots.forEach((sheetSnapshot: DocumentSnapshot) => {
                const sheet = sheetSnapshot.data() as SheetModel;
                if (!sheet.eventStartDate) {
                    promises.push(admin.firestore().collection('events').where('id', '==', sheet.relatedEventsIds[0]).limit(1).get()
                        .then((eventSnapshots: QuerySnapshot) => {
                            if (eventSnapshots.docs.length > 0) {
                                const relatedEvent = eventSnapshots.docs[0].data() as EventModel;
                                promises.push(admin.firestore().collection('sheets').doc(sheet.id).update({
                                    eventStartDate: relatedEvent.startDate,
                                    eventEndDate: relatedEvent.endDate
                                }));
                            }
                        }).catch((error) => {promises.push(error)}));
                }
            });
        }).catch((error) => {promises.push(error)}));
    return cors(req, res, () => { Promise.all(promises).then((values) => res.send(values)) });
}

