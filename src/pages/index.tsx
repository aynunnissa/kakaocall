import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { theme } from '@theme';
import { useContact } from '@/store/context/contact-context';

import { IContact } from '@/store/types/contact';
import Link from 'next/link';
import Pagination from '@/components/shared/Pagination';
import Header from '@/components/layout/Header';
import MainContainer from '@/components/layout/MainContainer';
import ContactList from '@/components/contact/ContactList';
import Head from 'next/head';
import Skeleton from '@/components/shared/Skeleton';
import dynamic from 'next/dynamic';

const searchBox = css({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  borderRadius: theme.shape.rounded.xl,
  boxShadow: theme.shadow.normal,

  [theme.breakpoints.md]: {
    display: 'none',
  },
});

const headerRightSide = css({
  display: 'flex',
  gap: theme.spacing.md,

  '.desktop-search': {
    display: 'none',

    [theme.breakpoints.md]: {
      display: 'block',
      width: '300px',
    },

    [theme.breakpoints.lg]: {
      display: 'block',
      width: '450px',
    },
  },
});

const headerRightContent = css({
  textDecoration: 'none',
  display: 'flex',
  fontSize: theme.text.xxl,
  padding: `${theme.spacing.lg} 0 ${theme.spacing.lg} ${theme.spacing.lg}`,
  color: theme.palette.primary.main,

  '.content-text': {
    display: 'none',
    fontSize: theme.text.md,
    fontWeight: 600,
  },

  '.content-icon': {
    color: theme.palette.primary.main,
    fontSize: theme.text['2xl'],
  },

  [theme.breakpoints.md]: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: theme.text.xl,
    padding: theme.spacing.sm,
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.shape.rounded.lg,

    '.content-text': {
      display: 'inline',
    },

    '.content-icon': {
      fontSize: theme.text.xl,
    },
  },
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

const SearchComponent = dynamic(
  () => import('@/components/contact/SearchContact'),
  {
    loading: () => (
      <Skeleton customClass={{ height: '40px', width: '100%' }}></Skeleton>
    ),
    ssr: false,
  }
);

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
      <Head>
        <title>kakaoico - Easily Manage Your Contact List</title>
        <meta
          name="description"
          content="Browse and manage your contacts seamlessly. Access your full contact list, and easily identify your favorite contacts for quick communication."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kakaoico.ico" />
      </Head>
      <Header justify="space-between">
        <div css={headerRightSide}>
          <div className="desktop-search">
            <SearchComponent onSearch={handleSearch} />
          </div>
          <Link
            href="/add-contact"
            css={headerRightContent}
            aria-label="Add a new contact"
          >
            <span className="kao-person_add_alt content-icon"></span>
            <span className="content-text">Add contact</span>
          </Link>
        </div>
      </Header>
      <MainContainer>
        <div css={searchBox}>
          <SearchComponent onSearch={handleSearch} />
        </div>
        {!onSearchMode && favoriteContacts.length > 0 && (
          <ContactList title="Favorite" contactListData={favoriteContacts} />
        )}
        {!onSearchMode && (
          <ContactList
            title="Contact List"
            contactListData={visibleContacts}
            noDataText="You haven't added any contacts yet"
          />
        )}
        {onSearchMode && (
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
            isLoadingPage={isLoadingPage}
            noDataText="Contact not found"
          />
        )}
        {state.isLoadingContact && (
          <Skeleton customClass={{ height: '20px', width: '100%' }}></Skeleton>
        )}
        {!state.isLoadingContact && totalPage > 1 && !onSearchMode && (
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
