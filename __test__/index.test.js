import { fireEvent, render, screen } from '@testing-library/react';
import ContactPage from '../src/pages/index';
import DefaultLayout from '../src/components/layout/DefaultLayout';
import {
  ContactStateContext,
  contactReducer,
} from '../src/store/context/contact-context';
import '@testing-library/jest-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useReducer } from 'react';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

function ContactProviderMock({ children, defaultContact }) {
  const [state, dispatch] = useReducer(contactReducer, {
    contactList: defaultContact ? defaultContact.state.contactList : [],
    isLoadingContact: false,
  });

  const value = { state, dispatch };

  return (
    <ContactStateContext.Provider value={value}>
      {children}
    </ContactStateContext.Provider>
  );
}

describe('Contact Page Content', () => {
  let client;

  const dispatch = jest.fn();
  const DUMMY_STATE = {
    contactList: [
      {
        id: 1,
        first_name: 'test 1',
        last_name: 'halo',
        phones: [],
      },
      {
        id: 2,
        first_name: 'test 2',
        last_name: 'halo',
        phones: [],
      },
    ],
    isLoadingContact: false,
  };

  beforeEach(() => {
    client = new ApolloClient({
      cache: new InMemoryCache(),
    });

    render(
      <ContactProviderMock defaultContact={{ state: DUMMY_STATE, dispatch }}>
        <ApolloProvider client={client}>
          <DefaultLayout>
            <ContactPage />
          </DefaultLayout>
        </ApolloProvider>
      </ContactProviderMock>
    );
  });

  describe('Static Components', () => {
    it('renders a level 1 heading', () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Phone Book'
      );
    });

    it('renders "Add contact" link', () => {
      const linkElement = screen.getByRole('link', {
        name: 'Add a new contact',
      });

      expect(linkElement).toBeInTheDocument();
    });

    it('renders search input', () => {
      const searchInput = screen.getAllByPlaceholderText(
        'Search contact name...'
      );

      expect(searchInput[0]).toBeInTheDocument();
    });
  });

  describe('Dynamic Components', () => {
    it('renders favorite section', () => {
      expect(screen.queryByText('Favorite')).toBeNull();

      const toggleButtons = screen.getAllByRole('button', {
        name: 'Favorite Button',
      });

      fireEvent.click(toggleButtons[0]);

      // If user has favorite contacts, Favorite Section and toast should be in the document
      expect(screen.getByText('Favorite')).toBeInTheDocument();
      expect(
        screen.getByText('Contact added to favorite!')
      ).toBeInTheDocument();
    });

    it('renders search result', () => {
      const searchInputs = screen.getAllByPlaceholderText(
        'Search contact name...'
      );
      const searchInput = searchInputs[0];

      fireEvent.change(searchInput, { target: { value: 'test 1' } });

      const relatedContact = screen.getByText('test 1 halo');
      const unRelatedContact = screen.queryByText('test 2 halo');

      // relatedContact is the contact that matches the search query, it should be in the document
      expect(relatedContact).toBeInTheDocument();
      expect(unRelatedContact).toBeNull();
    });

    it('delete contact from DOM', () => {
      // Before user click delete, all contact items should be available
      const contactItems = screen.getAllByTestId('contact-item');
      expect(contactItems.length).toBe(2);

      // Fire delete action
      const dropdownButtons = screen.getAllByRole('button', {
        name: 'Dropdown action',
      });

      fireEvent.click(dropdownButtons[0]);

      const deleteText = screen.getAllByText('Delete');

      const deleteElement = deleteText[0].closest('button');

      fireEvent.click(deleteElement);

      // After user click delete, the deleted contact should be removed from DOM
      const updatedContactItems = screen.getAllByTestId('contact-item');
      expect(updatedContactItems.length).toBe(1);
    });
  });
});
