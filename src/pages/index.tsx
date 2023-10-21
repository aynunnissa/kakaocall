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
import Pagination from '@/components/shared/Pagination';

const containerStyle = css({
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
});

const contactListContainer = css(containerStyle, {
  margin: `${theme.spacing.lg} 0`,
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  borderRadius: theme.shape.rounded.xl,
  boxShadow: theme.shadow.normal,
});

const searchBox = css(contactListContainer, {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
});

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.sm,
  color: theme.palette.primary.main,
});

const titleText = css({
  fontSize: theme.text.xxl,

  [theme.breakpoints.md]: {
    fontSize: theme.text['2xl'],
  },
});

const verticalStack = css({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,

  [theme.breakpoints.md]: {
    gap: theme.spacing.xl,
  },
});

const linkItem = css({
  textDecoration: 'none',

  '> span': {
    fontSize: theme.text.xxl,
  },
});

const subTitleText = css({
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: theme.text.md,
  margin: `${theme.spacing.md} 0`,

  [theme.breakpoints.md]: {
    fontSize: theme.text.xl,
  },
});

const notFoundText = css({
  textAlign: 'center',
});

/**
 * Style to handle header row on medium screen size
 */
const gridContainer = css({
  display: 'none',

  [theme.breakpoints.sm]: {
    display: 'grid',
    columnGap: theme.spacing.md,
    gridTemplateColumns:
      '[avatar] 4.5rem [contact] 3fr [phone] 2fr [actions] 3fr',
    alignItems: 'center',
    textAlign: 'left',
    fontSize: theme.text.md,
    color: theme.palette.grey[400],
    fontWeight: 500,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    marginBottom: theme.spacing.lg,
  },
});

/**
 * This style is used to handle layout shifts due to changes in the number of contact items
 */
const absolutePagination = css({
  position: 'absolute',
  bottom: 0,
  right: theme.spacing.lg,
});

const ContactPage = () => {
  const { state } = useContact();
  const [favoriteContacts, setFavoriteContacts] = useState<IContact[]>([]);
  const [regularContacts, setRegularContacts] = useState<IContact[]>([]);
  const [visibleContacts, setVisibleContacts] = useState<IContact[]>([]);
  const [onSearchMode, setOnSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState<IContact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChanged = (value: number) => {
    setCurrentPage(value);
  };

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

  useEffect(() => {
    if (currentPage < 1) return;

    const startIndex = currentPage * 10 - 10;
    const endIndex = currentPage * 10;

    setVisibleContacts(regularContacts.slice(startIndex, endIndex));
  }, [currentPage, regularContacts]);

  return (
    <main css={containerStyle}>
      <div css={headerStyle}>
        <h1 css={titleText}>Phone Book</h1>
        <Link href="/add-contact" css={linkItem}>
          <span className="kao-person_add_alt"></span>
        </Link>
      </div>
      <div css={searchBox}>
        <SearchContact onSearch={handleSearch} />
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
          <div css={gridContainer}>
            <div></div>
            <p>Name</p>
            <p>Phone Number</p>
            <div></div>
          </div>
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
              visibleContacts.map((item, ind: number) => (
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
      {Math.ceil(regularContacts.length / 10) > 1 && (
        <div
          css={
            visibleContacts.length + favoriteContacts.length < 10 &&
            absolutePagination
          }
        >
          <Pagination
            totalPages={Math.ceil(regularContacts.length / 10)}
            currentPage={currentPage}
            pageChanged={handlePageChanged}
          />
        </div>
      )}
    </main>
  );
};

export default ContactPage;
