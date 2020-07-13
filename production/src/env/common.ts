export interface confirmationOptions {
  message: string;
  additionalInformation?: string;
  onOptionYes?: Function;
  onOptionNo?: Function;
  onOptionCancel?: Function;
}
