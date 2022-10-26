export enum Macros {
  DOSSIER_NAME = 'DossierName',
  RECIPIENT_NAME = 'RecipientName',
  SENDER_NAME = 'SenderName',
  BOOKMARK_COUNT = 'BookmarkCount',
  MENTION_TARGET = 'MentionTarget',
  NOTIFICATION_COUNT = 'NewNotificationCount'
}

export enum DenotationChars {
  OPENING_BRACKET = '{',
  CLOSING_BRACKET = '}',
  AMPERSAND = '&',
  OPENING_SQUARE_BRACKET = '[',
  CLOSING_SQUARE_BRACKET = ']',
  AT = '@',
}

export enum BlotDefinition {
  NAME = 'macro',
  CLASS = 'macro',
  TAG = 'span',
}

export type ChangeEvent = { html: string; text: string, source?: string };

export type ChangeHandler = (event: ChangeEvent) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QuillModules = { [key: string]: any };

export interface MacroEditorProps {
  placeholder: string;
  defaultValue?: string;
  isMultiContent?: boolean;
  isNotificationReminder?: string;
  readOnly?: boolean;
  reset?: boolean;
  availableMacros?: Macros[];
  onChangeHandler: ChangeHandler;
}

export interface ListObject {
  id: number;
  value: string;
}

export interface MentionObject extends ListObject {
  index: number;
  denotationChar: string;
  link?: string;
  target?: string;
  disabled?: boolean;
}

export interface Delta {
  ops: [
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      insert: string | any;
      [prop: string]: unknown;
    }
  ];
}

export interface DeltaStatic {
  ops: [
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      insert: string | any;
      [prop: string]: unknown;
    }
  ];
}
export interface Range {
  index: number;
  length: 2;
}

export interface MatchedMacro {
  value: string;
  searchStringIndexInMacroValue: number;
  searchTermLength: number;
}
