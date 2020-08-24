import {TeacherUserModel} from '../core/models/users/teacher-user.model';

const admin = require('firebase-admin');

export const onUserDeleted = (snapshot: FirebaseFirestore.DocumentSnapshot, context: any) => {
    const user = snapshot.data() as TeacherUserModel;
    return admin.auth().revokeRefreshTokens(user.uid)
        .then(() => admin.auth().deleteUser(user.uid))
        .catch((err: Error) => {
            console.error(`Error while deleting ${user.uid}: `, err.message)
        })
}

