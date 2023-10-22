import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { IContact } from '@/store/types/contact';
import { ContactActions, Types } from '@/store/action/action';

type State = {
  contactList: IContact[];
  isLoadingContact: boolean;
};

type ContactProviderProps = { children: ReactNode };

const ContactStateContext = createContext<
  { state: State; dispatch: Dispatch<ContactActions> } | undefined
>(undefined);

function contactReducer(state: State, action: ContactActions) {
  switch (action.type) {
    case Types.Load: {
      const contactListData = action.payload.contactList
        ? [...action.payload.contactList]
        : [];

      localStorage.setItem('contacts', JSON.stringify(contactListData));
      return {
        contactList: contactListData,
        isLoadingContact: false,
      };
    }
    case Types.Add: {
      // Based on the requirement, no need to save new added contacts to local storage
      const newContactList = [...state.contactList, action.payload.contact];
      return {
        ...state,
        contactList: newContactList,
      };
    }
    case Types.Edit: {
      // Based on the requirement, no need to save edited contacts to local storage
      const editedContact = action.payload.contact;
      const newContactList = state.contactList.map(contact => {
        if (contact.id === editedContact.id) {
          return {
            ...contact,
            first_name: editedContact.first_name,
            last_name: editedContact.last_name,
            phones: editedContact.phones,
          };
        }
        return contact;
      });

      return {
        ...state,
        contactList: newContactList,
      };
    }
    case Types.Delete: {
      const newContactList = state.contactList.filter(
        contact => contact.id !== action.payload.id
      );
      return {
        ...state,
        contactList: newContactList,
      };
    }
    case Types.toggle_Favorite: {
      const contactCopy = state.contactList.map(contact => {
        if (contact.id === action.payload.id) {
          return {
            ...contact,
            is_favorite: !contact.is_favorite,
          };
        }
        return contact;
      });
      return {
        ...state,
        contactList: contactCopy,
      };
    }
  }
}

function ContactProvider({ children }: ContactProviderProps) {
  const [state, dispatch] = useReducer(contactReducer, {
    contactList: [],
    isLoadingContact: true,
  });

  const value = { state, dispatch };

  return (
    <ContactStateContext.Provider value={value}>
      {children}
    </ContactStateContext.Provider>
  );
}

function useContact() {
  const context = useContext(ContactStateContext);

  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
}

export { ContactProvider, useContact };
