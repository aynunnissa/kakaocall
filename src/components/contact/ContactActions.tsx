import { useState } from 'react';
import { css } from '@emotion/react';
import { theme } from '@theme';
import Link from 'next/link';
import ContactDropdown from './ContactDropdown';

const horizontalFlex = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
});

const inlineActions = css(horizontalFlex, {
  display: 'none',

  [theme.breakpoints.md]: {
    display: 'flex',
  },
});

const buttonStyle = css(horizontalFlex, {
  border: 'none',
  backgroundColor: 'transparent',
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  fontSize: theme.text.sm,
  fontFamily: 'inherit',
  color: theme.palette.common.black,
  cursor: 'pointer',
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'left',

  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },

  [theme.breakpoints.sm]: {
    padding: `${theme.spacing.sm}`,
  },

  [theme.breakpoints.md]: {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    boxShadow: theme.shadow.md,
  },
});

const buttonLinkStyle = css(buttonStyle, {
  textDecoration: 'none',
});

const editIconButton = css(buttonLinkStyle, {
  color: theme.palette.primary.main,

  [theme.breakpoints.md]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.rounded.md,

    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
});

const deleteIconButton = css(buttonStyle, {
  color: theme.palette.error.main,

  [theme.breakpoints.md]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    borderRadius: theme.shape.rounded.md,

    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
});

interface IProps {
  contactId: number;
  onDelete: () => void;
}

const ContactActions = ({ onDelete, contactId }: IProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const deleteContact = () => {
    onDelete();
    setIsMenuOpen(false);
  };

  const EditComponent = () => {
    return (
      <Link
        href={`/edit-contact/${contactId}`}
        css={editIconButton}
        onClick={toggleMenu}
        aria-label="Edit contact"
      >
        <span className="kao-pencil-square-o"></span> Edit
      </Link>
    );
  };

  const DeleteComponent = () => {
    return (
      <button css={deleteIconButton} onClick={deleteContact}>
        <span className="kao-trash-o"></span> Delete
      </button>
    );
  };

  return (
    <div>
      <ContactDropdown
        onDeleteContact={deleteContact}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      >
        <li>
          <EditComponent />
        </li>
        <li>
          <DeleteComponent />
        </li>
      </ContactDropdown>
      <div css={inlineActions}>
        <EditComponent />
        <DeleteComponent />
      </div>
    </div>
  );
};

export default ContactActions;
