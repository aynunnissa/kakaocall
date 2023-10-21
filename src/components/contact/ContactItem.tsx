import { Types } from '@/store/action/action';
import { useContact } from '@/store/context/contact-context';
import { IContact } from '@/store/types/contact';
import { css } from '@emotion/react';
import { theme } from '@theme';
import ContactActions from './ContactActions';

const flexContainer = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
});

const contactContainer = css(flexContainer, {
  justifyContent: 'space-between',
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
  justifySelf: 'end',
});

const avatarStyle = css({
  objectFit: 'cover',
  borderRadius: theme.shape.circle,
  height: '4.5rem',
  width: '4.5rem',
  backgroundColor: 'pink',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: theme.text.md,
});

const contactText = css({
  margin: 0,
});

const contactName = css(contactText, {
  fontSize: theme.text.md,
  fontWeight: 500,

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
});

const ContactItem = (props: IContact) => {
  const { dispatch } = useContact();

  /**
   * This method used to handle add contact to/remove contact from the favorite list
   */
  const toggleFavorite = () => {
    dispatch({
      type: Types.toggle_Favorite,
      payload: {
        id: props.id,
      },
    });
  };

  /**
   * Based on the requirements, the delete action do not use graphql
   * Delete action will remove contact item from contactList (list of contact in local storage remain the same)
   */
  const handleDelete = () => {
    dispatch({
      type: Types.Delete,
      payload: {
        id: props.id,
      },
    });
  };
  return (
    <div css={gridContainer}>
      <div css={avatarStyle}>{props.first_name.charAt(0)}</div>
      <div>
        <p css={contactName}>
          {props.first_name} {props.last_name}
        </p>
        <p css={contactNumber}>{props.phones?.[0]?.number}</p>
      </div>
      <div css={listContactNumber}>
        <p>{props.phones?.[0]?.number}</p>
      </div>
      <div css={actionsColumnStyle}>
        {props.is_favorite && (
          <button onClick={toggleFavorite} css={favoriteButtonStyle}>
            <span className="kao-star-full"></span>
          </button>
        )}
        {!props.is_favorite && (
          <button onClick={toggleFavorite} css={favoriteButtonStyle}>
            <span className="kao-star-empty"></span>
          </button>
        )}
        <ContactActions onDelete={handleDelete} contactId={props.id} />
      </div>
    </div>
  );
};

export default ContactItem;
