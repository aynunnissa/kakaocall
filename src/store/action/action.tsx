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
  Add = 'ADD_CONTACT',
  toggle_Favorite = 'TOGGLE_FAVORITE',
}

export type ContactPayload = {
  [Types.Load]: {
    contactList: IContact[];
  };
  [Types.Add]: {
    contact: IContact;
  };
  [Types.toggle_Favorite]: {
    id: number;
  };
};

export type ContactActions =
  ActionMap<ContactPayload>[keyof ActionMap<ContactPayload>];
