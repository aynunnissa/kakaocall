/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import { theme } from '@theme';
import contactList from '@/graphql/queries/GET_CONTACTS';
import { useContact } from '@/store/context/contact-context';
import { Types } from '@/store/action/action';

import Skeleton from '@/components/shared/Skeleton';
import ContactItem from '@/components/contact/ContactItem';

const SkeletonContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
});

const containerStyle = css({
  padding: `0 ${theme.spacing.md}`,
});

const contactListContainer = css(containerStyle, {
  margin: `${theme.spacing.sm} ${theme.spacing.lg}`,
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  borderRadius: theme.shape.rounded.md,
  boxShadow: theme.shadow.sm,
});

const subTitleText = css({
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: theme.text.md,
  margin: `${theme.spacing.md} 0`,
});

const contactListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

const ContactPage = () => {
  const { state, dispatch } = useContact();
  const [contactSaved, setContactSaved] = useState(true);
  const { loading, data } = useQuery(contactList, {
    skip: contactSaved,
  });

  useEffect(() => {
    const savedContact = localStorage.getItem('contacts');

    if (savedContact !== null) {
      dispatch({
        type: Types.Load,
        payload: {
          contactList: JSON.parse(savedContact),
        },
      });
    }

    setContactSaved(savedContact !== null);
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      dispatch({
        type: Types.Load,
        payload: {
          contactList: data.contact,
        },
      });
    }
  }, [dispatch, data]);

  return (
    <main>
      <div css={containerStyle}>
        <h1>Phone Book</h1>
      </div>
      <div css={contactListContainer}>
        <h2 css={subTitleText}>Contact List</h2>
        <div css={contactListStyle}>
          {loading ? (
            <div css={SkeletonContainer}>
              {[...Array(5)].map((num, ind) => (
                <Skeleton
                  key={`skeleton-${ind}`}
                  customClass={{ height: '50px', width: '100%' }}
                />
              ))}
            </div>
          ) : (
            state.contactList
              .filter(contact => !contact.is_favorite)
              .map((item, ind: number) => (
                <ContactItem
                  key={`contact-${ind}`}
                  id={item.id}
                  first_name={item.first_name}
                  last_name={item.last_name}
                  phones={item.phones}
                  is_favorite={item.is_favorite}
                />
              ))
          )}
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
