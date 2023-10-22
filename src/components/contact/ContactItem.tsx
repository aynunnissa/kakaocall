import { IContact } from '@/store/types/contact';
import { css } from '@emotion/react';
import { theme } from '@theme';
import ContactActions from './ContactActions';
import Avatar from './Avatar';

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

const actionsColumnStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  justifySelf: 'end',
});

const contactInfo = css({
  '.contact-name, .contact-number': {
    margin: 0,
  },

  '.contact-name': {
    fontSize: theme.text.md,
    fontWeight: 500,
    wordBreak: 'break-all',
  },

  '.contact-number': {
    fontSize: theme.text.xs,
    color: theme.palette.grey[400],
  },

  [theme.breakpoints.sm]: {
    '.contact-number': {
      display: 'none',
    },
  },

  [theme.breakpoints.md]: {
    '.contact-name': {
      fontSize: theme.text.lg,
    },
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
      <div css={contactInfo}>
        <p className="contact-name">
          {contact.first_name} {contact.last_name}
        </p>
        <p className="contact-number">{contact.phones?.[0]?.number}</p>
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
