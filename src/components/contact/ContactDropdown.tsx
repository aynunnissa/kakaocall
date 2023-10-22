import dynamic from 'next/dynamic';

import { css } from '@emotion/react';
import { theme } from '@theme';

import { useEffect, useRef, ReactNode } from 'react';
import Skeleton from '../shared/Skeleton';

const dropdown = css({
  position: 'relative',

  [theme.breakpoints.md]: {
    display: 'none',
  },
});

const iconButton = css({
  border: 'none',
  backgroundColor: 'transparent',
  padding: theme.spacing.md,
});

interface IProps {
  children: ReactNode;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  onDeleteContact: () => void;
}

const DropdownModal = dynamic(() => import('./DropdownModal'), {
  loading: () => (
    <Skeleton customClass={{ height: '100px', width: '100px' }}></Skeleton>
  ),
});

const ContactDropdown = ({ children, isMenuOpen, toggleMenu }: IProps) => {
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
      <button
        css={iconButton}
        onClick={toggleMenu}
        aria-label="Dropdown action"
      >
        <span className="kao-dots-horizontal-triple"></span>
      </button>
      {isMenuOpen && <DropdownModal>{children}</DropdownModal>}
    </div>
  );
};

export default ContactDropdown;
