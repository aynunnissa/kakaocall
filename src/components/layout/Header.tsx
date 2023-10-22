import { css } from '@emotion/react';
import { theme } from '@theme';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  justify?: 'space-between' | 'space-around' | 'space-evenly' | 'flex-end';
}

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
  padding: `${theme.spacing.lg} ${theme.spacing.xl} 0 ${theme.spacing.xl}`,
  color: theme.palette.primary.main,

  '.header-link': {
    textDecoration: 'none',
    display: 'flex',
    color: 'inherit',
  },

  '.header-title': {
    fontSize: theme.text.xxl,
    margin: 0,
  },

  '.header-icon': {
    padding: `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.lg} 0`,
  },

  [theme.breakpoints.md]: {
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.primary.main,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,

    '.header-title': {
      fontSize: theme.text['2xl'],
    },
  },
});

const Header = ({ children, justify }: IProps) => {
  const router = useRouter();
  const path = router.pathname.split('/')[1];
  const isHomepage = path === '';

  return (
    <div css={headerStyle} style={{ justifyContent: justify }}>
      {/* Pages will have back button, except home page */}
      {!isHomepage && (
        <Link href="/" className="header-link" aria-label="Back to home page">
          <span className="kao-arrow-left header-icon"></span>
        </Link>
      )}
      <h1 className="header-title">Phone Book</h1>
      {isHomepage && children}
    </div>
  );
};

export default Header;
