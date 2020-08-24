import {SendgridMailModel} from '../core/models/mails/sendgrid-mail.model';

const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const sender = {email: 'contact@diploma-sante.fr', name: 'Diploma Santé'}
sgMail.setApiKey(functions.config().sendgrid.key);

export const mailingService =  {
    async sendMail(mailId: string, receivers: string[], data: any) {
        const msg: SendgridMailModel = {
            to: receivers,
            from: sender,
            templateId: mailId,
            dynamic_template_data: data
        };
        return sgMail.sendMultiple(msg);
    }
}
