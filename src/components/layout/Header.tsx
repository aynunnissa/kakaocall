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

  '> a': {
    textDecoration: 'none',
    display: 'flex',
  },

  [theme.breakpoints.md]: {
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.primary.main,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,

    '> a': {
      color: 'inherit',
    },
  },
});

const titleTextStyle = css({
  color: theme.palette.primary.main,
  fontSize: theme.text.xxl,
  margin: 0,

  [theme.breakpoints.md]: {
    fontSize: theme.text['2xl'],
    color: theme.palette.common.white,
  },
});

const backIconStyle = css({
  color: theme.palette.primary.main,
  padding: `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.lg} 0`,
});
const Header = ({ children, justify }: IProps) => {
  const router = useRouter();
  const path = router.pathname.split('/')[1];
  const isHomepage = path === '';

  const customJustify = css(headerStyle, {
    justifyContent: justify ? justify : 'normal',
  });

  return (
    <div css={justify ? customJustify : headerStyle}>
      {/* Pages will have back button, except home page */}
      {!isHomepage && (
        <Link href="/" aria-label="Back to home page">
          <span css={backIconStyle} className="kao-arrow-left"></span>
        </Link>
      )}
      <h1 css={titleTextStyle}>Phone Book</h1>
      {isHomepage && children}
    </div>
  );
};

export default Header;
