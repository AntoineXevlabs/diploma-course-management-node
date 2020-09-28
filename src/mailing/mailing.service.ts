import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import {mailParser} from '../core/constants/mail-parser';

const sender = '"[Diploma Santé] Ne pas répondre" <notifications@diploma-sante.fr>';
const templateLocations = '../assets/emailTemplates';


const transporter = nodemailer.createTransport({
    host: 'ssl0.ovh.net',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'notifications@diploma-sante.fr',
        pass: 'notifications',
    },
});

function readLocalTemplate(template: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            var filename = require.resolve(`${templateLocations}/${template}`);
            // @ts-ignore
            fs.readFile(filename, 'utf8', (err, res) => {
                return resolve(res);
            });
        } catch (e) {
            reject(e);
        }
    });
}

const processStringReplacement = (data: any, string: string) => {
    let cleanString = string.split(' ')[1];
    if (!cleanString) {
        return;
    }
    if (cleanString.includes('.')) {
        const keys = cleanString.split('.');
        let value = data;
        let index = 0;
        while (value[keys[index]] && index < keys.length) {
            value = value[keys[index]];
            index += 1;
        }
        return typeof value === 'string' ? value : '';
    }
    return data[cleanString] ? data[cleanString] : '';
};
const processMail = (to: string[], templateId: string, data: any) => {
    const template = mailParser[templateId];
    return readLocalTemplate(template.path)
        .then((html: string) => {
            const htmlStringified = html.replace(
                new RegExp(`{{{ .* }}}`, 'gmi'),
                (match: string) => processStringReplacement(data, match)
            );
            return transporter.sendMail({
                from: sender,
                to,
                subject: template.subject,
                html: htmlStringified
            });
        });
};


export const mailingService = {
    async sendMail(mailId: string, receivers: string[], data: any) {
        return processMail(
            receivers,
            mailId,
            data,
        ).then(_ => {
            console.log(`Mail ${mailId} sucessfully send to ${receivers[0]}`);
        })
            .catch((error: Error) => {
                console.error(error.message);
            });
    }
};
