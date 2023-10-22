import { theme } from '@theme';
import ContactItem from './ContactItem';
import { css } from '@emotion/react';
import { useContact } from '@/store/context/contact-context';
import Skeleton from '../shared/Skeleton';
import { IContact } from '@/store/types/contact';
import { ReactNode } from 'react';
import ContactHeaderDesktop from './ContactHeaderDesktop';
import { Types } from '@/store/action/action';

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
  onOpenToast: (text: string) => void;
}

const ContactList = ({
  title,
  contactListData,
  isLoadingPage,
  noDataText,
  onOpenToast,
}: IProps) => {
  const { state } = useContact();

  const { dispatch } = useContact();

  /**
   * This method used to handle add contact to/remove contact from the favorite list
   */
  const toggleFavorite = (id: number, text: string) => {
    onOpenToast(text);
    dispatch({
      type: Types.toggle_Favorite,
      payload: {
        id: id,
      },
    });
  };

  /**
   * Based on the requirements, the delete action do not use graphql
   * Delete action will remove contact item from contactList (list of contact in local storage remain the same)
   */
  const handleDelete = (id: number) => {
    onOpenToast('Contact deleted successfully!');
    dispatch({
      type: Types.Delete,
      payload: {
        id: id,
      },
    });
  };

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
              contact={item}
              onDelete={handleDelete}
              toggleFavorite={toggleFavorite}
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
