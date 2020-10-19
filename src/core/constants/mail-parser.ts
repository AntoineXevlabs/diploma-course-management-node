export const mailParser: {[key:string] :{
    path: string;
    subject: string;
    }} = {
    'event_creation_email': {
        path: 'event_creation_template.html',
        subject: '🔔 Nouveau cours à enregistrer 🔔'
    },
    'registration_email': {
        path: 'registration.html',
        subject: 'Bienvenue chez Diploma Sante !'
    },
    'event_reminder_email': {
        path: 'event_reminder_template.html',
        subject: 'Enregistrement Demain !'
    },
    'transcript_reminder_email': {
        path: 'transcript_reminder_template.html',
        subject: 'RAPPEL: Transcription à réaliser'
    },
    'transcription_creation_email': {
        path: 'transcription_creation_template.html',
        subject: 'Nouvelle transcription à effectuer'
    },
    'sheet_creation_email': {
        path: 'sheet_creation_template.html',
        subject: 'Nouvelle fiche à réaliser'
    },
    'map_creation_email': {
        path: 'map_creation_template.html',
        subject: 'Nouveau plan à réaliser'
    },
    'validation_creation_email': {
        path: 'validation_creation_template.html',
        subject: 'Nouvelle fiche à valider'
    }
}
