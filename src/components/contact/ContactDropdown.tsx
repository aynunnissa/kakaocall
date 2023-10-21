import { css } from '@emotion/react';
import { theme } from '@theme';
import Link from 'next/link';

import { useEffect, useState, useRef, ReactNode } from 'react';

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

const iconButton = css({
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
});

interface IProps {
  children: ReactNode;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  onDeleteContact: () => void;
}

const ContactDropdown = ({
  children,
  isMenuOpen,
  toggleMenu,
  onDeleteContact,
}: IProps) => {
  const ref = useRef<any>(null);

  /**
   * This useEffect used to handle click outside action
   */
  useEffect(() => {
    const handleClickOutside = (event: TouchEvent | MouseEvent) => {
      if (isMenuOpen && ref.current && !ref.current.contains(event.target)) {
        toggleMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen, toggleMenu]);

  return (
    <div css={dropdown} ref={ref}>
      <button css={iconButton} onClick={toggleMenu}>
        <span className="kao-dots-horizontal-triple"></span>
      </button>
      {isMenuOpen && <ul css={menuContainer}>{children}</ul>}
    </div>
  );
};

export default ContactDropdown;
