
import {EventModel} from '../core/models/event.model';
import {eventService} from './event.service';

export const onEventCreated = (snapshot: FirebaseFirestore.DocumentSnapshot, context: any) => {
    const event = snapshot.data() as EventModel;
    return eventService.eventCreated(event);
}
