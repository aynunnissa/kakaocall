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
};

type ContactProviderProps = { children: ReactNode };

const ContactStateContext = createContext<
  { state: State; dispatch: Dispatch<ContactActions> } | undefined
>(undefined);

function contactReducer(state: State, action: ContactActions) {
  switch (action.type) {
    case Types.Load: {
      const contactListData = [...action.payload.contactList];

      localStorage.setItem('contacts', JSON.stringify(contactListData));
      return {
        contactList: contactListData,
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
        contactList: contactCopy,
      };
    }
  }
}

function ContactProvider({ children }: ContactProviderProps) {
  const [state, dispatch] = useReducer(contactReducer, { contactList: [] });

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
