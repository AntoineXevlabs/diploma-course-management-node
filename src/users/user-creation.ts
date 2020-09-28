import {UserRecord} from 'firebase-functions/lib/providers/auth';
import {mailingService} from '../mailing/mailing.service';
import {TeacherUserModel} from '../core/models/users/teacher-user.model';
import {pwdGenerator} from '../core/constants/pwd-generator.constant';


const admin = require('firebase-admin');
const mailRegistrationId = 'registration_email'

export const onUserCreated = (snapshot: FirebaseFirestore.DocumentSnapshot, context: any) => {
    const user = snapshot.data() as TeacherUserModel;
    const firebaseUser = {
        uid: user.uid,
        email: user.email,
        password: pwdGenerator(),
        displayName: user.firstName + ' ' + user.lastName,
        buttonUrl: "https://fiches.diploma-sante.fr"
    }
    return admin.auth().createUser(firebaseUser).then((userRecord: UserRecord) => {
        return mailingService.sendMail(mailRegistrationId, [firebaseUser.email], {user: firebaseUser})
    })
        .catch((err: Error) => {
            console.error(`Error while registering ${firebaseUser.uid}: `, err.message)
        })
}

