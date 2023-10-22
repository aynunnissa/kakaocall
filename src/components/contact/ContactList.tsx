import { theme } from '@theme';
import ContactItem from './ContactItem';
import { css } from '@emotion/react';
import { useContact } from '@/store/context/contact-context';
import Skeleton from '../shared/Skeleton';
import { IContact } from '@/store/types/contact';
import { ReactNode } from 'react';
import ContactHeaderDesktop from './ContactHeaderDesktop';

const contactListContainer = css({
  margin: `${theme.spacing.lg} 0`,
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  borderRadius: theme.shape.rounded.xl,
  boxShadow: theme.shadow.normal,

  '.contact-subtitle': {
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: theme.text.md,
    margin: `${theme.spacing.md} 0`,
  },

  '.not-found-text': {
    fontSize: theme.text.md,
    textAlign: 'center',
  },

  [theme.breakpoints.md]: {
    '.contact-subtitle': {
      fontSize: theme.text.xl,
    },
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

interface IProps {
  title: ReactNode;
  contactListData: IContact[];
  isLoadingPage?: boolean;
  noDataText?: string;
}

const ContactList = ({
  title,
  contactListData,
  isLoadingPage,
  noDataText,
}: IProps) => {
  const { state } = useContact();

  return (
    <div css={contactListContainer}>
      <h2 className="contact-subtitle">{title}</h2>
      <ContactHeaderDesktop />
      <div css={verticalStack}>
        {state.isLoadingContact || isLoadingPage ? (
          <div css={verticalStack}>
            {[...Array(4)].map((num, ind) => (
              <Skeleton
                key={`skeleton-${ind}`}
                customClass={{ height: '50px', width: '100%' }}
              />
            ))}
          </div>
        ) : contactListData.length > 0 ? (
          contactListData.map((item, ind: number) => (
            <ContactItem
              key={`contact-${ind}`}
              id={item.id}
              first_name={item.first_name}
              last_name={item.last_name}
              phones={item.phones}
              is_favorite={item.is_favorite}
            />
          ))
        ) : (
          <p className="not-found-text">{noDataText}</p>
        )}
      </div>
    </div>
  );
};

export default ContactList;
