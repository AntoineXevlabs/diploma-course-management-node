import {SheetModel} from '../core/models/sheet.model';
import {sheetService} from './sheet.service';

export const onSheetCreated = (snapshot: FirebaseFirestore.DocumentSnapshot, context: any) => {
    const sheet = snapshot.data() as SheetModel;
    return sheetService.processSheetCreated(sheet);
}
