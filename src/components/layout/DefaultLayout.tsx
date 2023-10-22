import { useLazyQuery } from '@apollo/client';
import { ReactNode, useEffect } from 'react';

import GET_CONTACT_LIST from '@/graphql/queries/GET_CONTACTS';
import { Types } from '@/store/action/action';
import { useContact } from '@/store/context/contact-context';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const [getContactList] = useLazyQuery(GET_CONTACT_LIST, {
    onCompleted({ contact }) {
      dispatch({
        type: Types.Load,
        payload: {
          contactList: contact,
        },
      });
    },
  });
  const { dispatch } = useContact();

  useEffect(() => {
    const savedContact = localStorage.getItem('contacts');

    if (savedContact !== null) {
      dispatch({
        type: Types.Load,
        payload: {
          contactList: JSON.parse(savedContact),
        },
      });
    } else {
      getContactList();
    }
  }, [dispatch, getContactList]);

  return <div>{children}</div>;
};

export default DefaultLayout;
