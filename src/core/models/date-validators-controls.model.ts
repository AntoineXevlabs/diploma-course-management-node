export interface DateValidatorsControlsModel {
  hasHours: boolean;
  bounded: boolean;
  bounds: string;
  from: Date;
  fromHours?: number;
  fromMinutes?: number;
  to: Date;
  toHours?: number;
  toMinutes?: number;
}
