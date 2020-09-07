import {EventModel} from '../core/models/event.model';
import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {TeacherUserModel} from '../core/models/users/teacher-user.model';
import {DateParser} from '../core/constants/date-parser.constant';
import {mailingService} from '../mailing/mailing.service';
import QuerySnapshot = FirebaseFirestore.QuerySnapshot;

const eventCreationMailTemplateId = 'd-bb365096f16e4577b2547d85587e0cdd';

export const eventService: { eventCreated: (event: EventModel) => any } = {
    eventCreated(event: EventModel) {
        return admin.firestore().collection('users').where('uid', 'in', event.recorder).get()
            .then((userSnapshots: QuerySnapshot) => {
                userSnapshots.forEach((userSnapshot: DocumentSnapshot) => {
                    const user = userSnapshot.data() as TeacherUserModel;
                    const messageData = {
                        course: event.course,
                        university: event.university,
                        localistation: event.location,
                        buttonUrl: 'https://fiches.diploma-sante.fr',
                        eventDate: DateParser(event.startDate)
                    };
                    return mailingService.sendMail(eventCreationMailTemplateId, [user.email], messageData);
                })
            })
            .catch((error: Error) => {
                console.error(error.name);
                console.error(error.message);
            });
    }
};
