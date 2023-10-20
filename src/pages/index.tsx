/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { theme } from '@theme';
import { useContact } from '@/store/context/contact-context';

import Skeleton from '@/components/shared/Skeleton';
import ContactItem from '@/components/contact/ContactItem';
import { IContact } from '@/store/types/contact';
import Link from 'next/link';
import SearchContact from '@/components/contact/SearchContact';

const verticalStack = css({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
});

const horizontalStack = css({
  display: 'flex',
  alignItems: 'center',
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

const FlexContainer = css(horizontalStack, contactListContainer);

const subTitleText = css({
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: theme.text.md,
  margin: `${theme.spacing.md} 0`,
});

const notFoundText = css({
  textAlign: 'center',
});

const ContactPage = () => {
  const { state } = useContact();
  const [favoriteContacts, setFavoriteContacts] = useState<IContact[]>([]);
  const [regularContacts, setRegularContacts] = useState<IContact[]>([]);
  const [onSearchMode, setOnSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState<IContact[]>([]);

  /**
   * Function to handle contact search
   */
  const handleSearch = (query: string) => {
    if (!query) {
      setOnSearchMode(false);
    } else {
      setOnSearchMode(true);

      const contactFiltered = state.contactList.filter(contact => {
        const name = `${contact.first_name} ${contact.last_name}`;
        if (name.toLowerCase().includes(query.toLowerCase())) return contact;
      });

      setSearchResult(contactFiltered);
    }
  };

  useEffect(() => {
    const favoriteList: IContact[] = [];
    const regularList: IContact[] = [];

    state.contactList.forEach(contact => {
      if (contact.is_favorite) favoriteList.push(contact);
      else regularList.push(contact);
    });

    setFavoriteContacts(favoriteList);
    setRegularContacts(regularList);
  }, [state.contactList]);

  return (
    <main>
      <div css={containerStyle}>
        <h1>Phone Book</h1>
      </div>
      <div css={FlexContainer}>
        <SearchContact onSearch={handleSearch} />
        <Link href="/add-contact">Add</Link>
      </div>
      {!onSearchMode && favoriteContacts.length > 0 && (
        <div css={contactListContainer}>
          <h2 css={subTitleText}>Favorite</h2>
          <div css={verticalStack}>
            {state.isLoadingContact ? (
              <div css={verticalStack}>
                {[...Array(2)].map((num, ind) => (
                  <Skeleton
                    key={`skeleton-${ind}`}
                    customClass={{ height: '50px', width: '100%' }}
                  />
                ))}
              </div>
            ) : (
              favoriteContacts.map((item, ind: number) => (
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
      )}
      {!onSearchMode && (
        <div css={contactListContainer}>
          <h2 css={subTitleText}>Contact List</h2>
          <div css={verticalStack}>
            {state.isLoadingContact ? (
              <div css={verticalStack}>
                {[...Array(3)].map((num, ind) => (
                  <Skeleton
                    key={`skeleton-${ind}`}
                    customClass={{ height: '50px', width: '100%' }}
                  />
                ))}
              </div>
            ) : (
              regularContacts.map((item, ind: number) => (
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
      )}
      {onSearchMode && (
        <div css={contactListContainer}>
          {searchResult.length > 0 ? (
            <div>
              <h2 css={subTitleText}>Contact List</h2>
              <div css={verticalStack}>
                {searchResult.map((item, ind: number) => (
                  <ContactItem
                    key={`contact-${ind}`}
                    id={item.id}
                    first_name={item.first_name}
                    last_name={item.last_name}
                    phones={item.phones}
                    is_favorite={item.is_favorite}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p css={notFoundText}>Contact not found</p>
          )}
        </div>
      )}
    </main>
  );
};

export default ContactPage;
