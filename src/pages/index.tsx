import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { theme } from '@theme';
import { useContact } from '@/store/context/contact-context';

import { IContact } from '@/store/types/contact';
import Link from 'next/link';
import SearchContact from '@/components/contact/SearchContact';
import Pagination from '@/components/shared/Pagination';
import Header from '@/components/layout/Header';
import MainContainer from '@/components/layout/MainContainer';
import ContactList from '@/components/contact/ContactList';

const contactListContainer = css({
  margin: `${theme.spacing.lg} 0`,
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  borderRadius: theme.shape.rounded.xl,
  boxShadow: theme.shadow.normal,
});

const searchBox = css(contactListContainer, {
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  marginTop: 0,

  [theme.breakpoints.md]: {
    display: 'none',
  },
});

const mobileSearchBox = css({
  display: 'none',

  [theme.breakpoints.md]: {
    display: 'block',
    width: '300px',
  },

  [theme.breakpoints.lg]: {
    display: 'block',
    width: '450px',
  },
});

const addLinkStyle = css({
  textDecoration: 'none',
  display: 'flex',
  fontSize: theme.text.xxl,

  [theme.breakpoints.md]: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: theme.text.xl,
    color: theme.palette.primary.main,
    padding: theme.spacing.sm,
    textDecoration: 'none',
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.shape.rounded.lg,
  },
});

const addTextStyle = css({
  display: 'none',
  fontSize: theme.text.md,
  fontWeight: 600,

  [theme.breakpoints.md]: {
    display: 'inline',
  },
});

const headerRightSide = css({
  display: 'flex',
  gap: theme.spacing.md,
});

const notFoundText = css({
  fontSize: theme.text.md,
  textAlign: 'center',
});

const contactFoundText = css({
  fontSize: theme.text.sm,
  color: theme.palette.grey[400],
  fontWeight: 400,
});

/**
 * This style is used to handle layout shifts due to changes in the number of contact items
 */
const absolutePagination = css({
  position: 'absolute',
  bottom: 0,
  right: theme.spacing.xl,
});

const ContactPage = () => {
  const { state } = useContact();
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [favoriteContacts, setFavoriteContacts] = useState<IContact[]>([]);
  const [regularContacts, setRegularContacts] = useState<IContact[]>([]);
  const [visibleContacts, setVisibleContacts] = useState<IContact[]>([]);
  const [onSearchMode, setOnSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState<IContact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

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

    const totalPageCount = Math.ceil(regularList.length / 10);

    setFavoriteContacts(favoriteList);
    setRegularContacts(regularList);
    setTotalPage(totalPageCount);
  }, [state.contactList]);

  /**
   * Effect for handling page count changes because the regular contact list count changes
   * due to a favorite or delete action
   */
  useEffect(() => {
    if (currentPage > totalPage && totalPage > 0) {
      setCurrentPage(totalPage);
    }
  }, [currentPage, totalPage]);

  useEffect(() => {
    if (currentPage < 1) return;

    const startIndex = currentPage * 10 - 10;
    const endIndex = currentPage * 10;

    setVisibleContacts(regularContacts.slice(startIndex, endIndex));
    setIsLoadingPage(false);
  }, [currentPage, regularContacts]);

  return (
    <div>
      <Header justify="space-between">
        <h1>Phone Book</h1>
        <div css={headerRightSide}>
          <div css={mobileSearchBox}>
            <SearchContact onSearch={handleSearch} />
          </div>
          <Link href="/add-contact" css={addLinkStyle}>
            <span className="kao-person_add_alt"></span>
            <span css={addTextStyle}>Add contact</span>
          </Link>
        </div>
      </Header>
      <MainContainer>
        <div css={searchBox}>
          <SearchContact onSearch={handleSearch} />
        </div>
        {!onSearchMode && favoriteContacts.length > 0 && (
          <ContactList title="Favorite" contactListData={favoriteContacts} />
        )}
        {!onSearchMode && (
          <ContactList title="Contact List" contactListData={visibleContacts} />
        )}
        {onSearchMode && searchResult.length <= 0 && (
          <div css={contactListContainer}>
            <p css={notFoundText}>Contact not found</p>
          </div>
        )}
        {onSearchMode && searchResult.length > 0 && (
          <ContactList
            title={
              <span>
                Contact List{' '}
                <span css={contactFoundText}>
                  ({searchResult.length} found)
                </span>
              </span>
            }
            contactListData={searchResult}
          />
        )}
        {totalPage > 1 && !onSearchMode && (
          <div
            css={
              visibleContacts.length + favoriteContacts.length < 10 &&
              absolutePagination
            }
          >
            <Pagination
              totalPages={totalPage}
              currentPage={currentPage}
              pageChanged={handlePageChanged}
            />
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default ContactPage;
