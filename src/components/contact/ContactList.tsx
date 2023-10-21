import { theme } from '@theme';
import ContactItem from './ContactItem';
import { css } from '@emotion/react';
import { useContact } from '@/store/context/contact-context';
import Skeleton from '../shared/Skeleton';
import { IContact } from '@/store/types/contact';
import { ReactNode } from 'react';

const contactListContainer = css({
  margin: `${theme.spacing.lg} 0`,
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  borderRadius: theme.shape.rounded.xl,
  boxShadow: theme.shadow.normal,
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

const verticalStack = css({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,

  [theme.breakpoints.md]: {
    gap: theme.spacing.xl,
  },
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

interface IProps {
  title: ReactNode;
  contactListData: IContact[];
  isLoadingPage?: boolean;
}

const ContactList = ({ title, contactListData, isLoadingPage }: IProps) => {
  const { state } = useContact();
  return (
    <div css={contactListContainer}>
      <h2 css={subTitleText}>{title}</h2>
      <div css={gridContainer}>
        <div></div>
        <p>Name</p>
        <p>Phone Number</p>
        <div></div>
      </div>
      <div css={verticalStack}>
        {state.isLoadingContact || isLoadingPage ? (
          <div css={verticalStack}>
            {[...Array(3)].map((num, ind) => (
              <Skeleton
                key={`skeleton-${ind}`}
                customClass={{ height: '50px', width: '100%' }}
              />
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ContactList;
