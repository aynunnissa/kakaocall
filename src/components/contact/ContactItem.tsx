import { IContact } from '@/store/types/contact';
import { css } from '@emotion/react';
import { theme } from '@theme';
import ContactActions from './ContactActions';
import Avatar from './Avatar';

const flexContainer = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
});

const gridContainer = css({
  display: 'grid',
  gridTemplateColumns: '[avatar] 4.5rem [contact] 3fr [actions] 1fr',
  columnGap: theme.spacing.sm,
  rowGap: theme.spacing.md,
  alignItems: 'center',

  [theme.breakpoints.sm]: {
    columnGap: theme.spacing.md,
    gridTemplateColumns:
      '[avatar] 4.5rem [contact] 3fr [phone] 2fr [actions] 3fr',
  },
});

const actionsColumnStyle = css(flexContainer, {
  gap: '2px',
  justifySelf: 'end',
});

const contactText = css({
  margin: 0,
});

const contactName = css(contactText, {
  fontSize: theme.text.md,
  fontWeight: 500,
  wordBreak: 'break-all',

  [theme.breakpoints.md]: {
    fontSize: theme.text.lg,
  },
});

const contactNumber = css(contactText, {
  fontSize: theme.text.xs,
  color: theme.palette.grey[400],

  [theme.breakpoints.sm]: {
    display: 'none',
  },
});

const listContactNumber = css({
  display: 'none',

  [theme.breakpoints.sm]: {
    display: 'block',
    fontSize: theme.text.md,
    color: theme.palette.grey[400],
  },
});

const favoriteButtonStyle = css({
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  color: theme.palette.warning.main,
  padding: theme.spacing.md,
});

interface IProps {
  contact: IContact;
  onDelete: (id: number) => void;
  toggleFavorite: (id: number, text: string) => void;
}

const ContactItem = ({ contact, onDelete, toggleFavorite }: IProps) => {
  return (
    <div css={gridContainer} data-testid="contact-item">
      <Avatar initial={contact.first_name.charAt(0)} />
      <div>
        <p css={contactName}>
          {contact.first_name} {contact.last_name}
        </p>
        <p css={contactNumber}>{contact.phones?.[0]?.number}</p>
      </div>
      <div css={listContactNumber}>
        <p>{contact.phones?.[0]?.number}</p>
      </div>
      <div css={actionsColumnStyle}>
        <button
          onClick={() =>
            toggleFavorite(
              contact.id,
              `Contact ${
                contact.is_favorite ? 'removed from' : 'added to'
              } favorite!`
            )
          }
          css={favoriteButtonStyle}
          aria-label="Favorite Button"
        >
          {contact.is_favorite && <span className="kao-star-full"></span>}
          {!contact.is_favorite && <span className="kao-star-empty"></span>}
        </button>
        <ContactActions
          onDelete={() => onDelete(contact.id)}
          contactId={contact.id}
        />
      </div>
    </div>
  );
};

export default ContactItem;
