import { css } from '@emotion/react';
import { theme } from '@theme';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  justify?: 'space-between' | 'space-around' | 'space-evenly' | 'flex-end';
}

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
  color: theme.palette.primary.main,
  padding: `${theme.spacing.lg} ${theme.spacing.xl} 0 ${theme.spacing.xl}`,

  '> h1': {
    fontSize: theme.text.xxl,
    margin: 0,

    [theme.breakpoints.md]: {
      fontSize: theme.text['2xl'],
    },
  },

  '> a': {
    textDecoration: 'none',
    display: 'flex',

    '> span': {
      fontSize: theme.text.xxl,
    },
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
const Header = ({ children, justify }: IProps) => {
  const customJustify = css(headerStyle, {
    justifyContent: justify ? justify : 'normal',
  });

  return <div css={justify ? customJustify : headerStyle}>{children}</div>;
};

export default Header;
