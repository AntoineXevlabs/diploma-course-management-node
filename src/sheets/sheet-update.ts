import {SheetModel} from '../core/models/sheet.model';
import {sheetService} from './sheet.service';
import {Change} from 'firebase-functions';
import {QueryDocumentSnapshot} from 'firebase-functions/lib/providers/firestore';

export const onSheetUpdated = (snapshot: Change<QueryDocumentSnapshot>, context: any) => {
    const oldSheet = snapshot.before.data() as SheetModel;
    const newSheet = snapshot.after.data() as SheetModel;
    return sheetService.processSheetUpdated(oldSheet, newSheet);
}
