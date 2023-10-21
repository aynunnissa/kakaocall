import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { theme } from '@theme';
import Link from 'next/link';

const horizontalFlex = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
});

const dropdown = css({
  position: 'relative',

  [theme.breakpoints.md]: {
    display: 'none',
  },
});

const menuContainer = css({
  listStyle: 'none',
  position: 'absolute',
  backgroundColor: theme.palette.common.white,
  padding: 0,
  right: 0,
  zIndex: 1001,
  margin: 0,
  borderRadius: theme.shape.rounded.sm,
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

const iconButton = css({
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
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

const ContactDropdown = ({ onDelete, contactId }: IProps) => {
  const ref = useRef<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const deleteContact = () => {
    setIsMenuOpen(false);
    onDelete();
  };

  /**
   * This useEffect used to handle click outside action
   */
  useEffect(() => {
    const handleClickOutside = (event: TouchEvent | MouseEvent) => {
      if (isMenuOpen && ref.current && !ref.current.contains(event.target)) {
        setIsMenuOpen(false);
        console.log('masuk');
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div>
      <div css={dropdown} ref={ref}>
        <button css={iconButton} onClick={toggleMenu}>
          <span className="kao-dots-horizontal-triple"></span>
        </button>
        {isMenuOpen && (
          <ul css={menuContainer}>
            <li>
              <Link href={`/edit-contact/${contactId}`} css={editIconButton}>
                <span className="kao-pencil-square-o"></span> Edit
              </Link>
            </li>
            <li>
              <button css={deleteIconButton} onClick={deleteContact}>
                <span className="kao-trash-o"></span> Delete
              </button>
            </li>
          </ul>
        )}
      </div>
      <div css={inlineActions}>
        <Link href={`/edit-contact/${contactId}`} css={editIconButton}>
          <span className="kao-pencil-square-o"></span> Edit
        </Link>
        <button css={deleteIconButton} onClick={deleteContact}>
          <span className="kao-trash-o"></span> Delete
        </button>
      </div>
    </div>
  );
};

export default ContactDropdown;
