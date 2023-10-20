import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { theme } from '@theme';

const dropdown = css({
  position: 'relative',
});

const menuContainer = css({
  listStyle: 'none',
  position: 'absolute',
  backgroundColor: theme.palette.common.white,
  padding: 0,
  right: 0,
  zIndex: 1001,
  margin: 0,
  boxShadow: theme.shadow.sm,
  borderRadius: theme.shape.rounded.sm,
});

const buttonStyle = css({
  border: 'none',
  backgroundColor: 'transparent',
  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',

  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
});

const icon = css({
  // temp
  width: '10px',
  height: '30px',
  backgroundColor: 'pink',
  border: 'none',
});

interface IProps {
  onDelete: () => void;
  onEdit?: () => void;
}

const ContactDropdown = ({ onDelete }: IProps) => {
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
    <div css={dropdown} ref={ref}>
      <button css={icon} onClick={toggleMenu}></button>
      {isMenuOpen && (
        <ul css={menuContainer}>
          <li>
            <button css={buttonStyle}>Edit</button>
          </li>
          <li>
            <button css={buttonStyle} onClick={deleteContact}>
              Delete
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ContactDropdown;
