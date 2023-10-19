import { IContact } from '@/store/types/contact';

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  Load = 'LOAD_CONTACT',
}

export type ContactPayload = {
  [Types.Load]: {
    contactList: IContact[];
  };
};

export type ContactActions =
  ActionMap<ContactPayload>[keyof ActionMap<ContactPayload>];
