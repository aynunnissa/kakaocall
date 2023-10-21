import { css } from '@emotion/react';
import { theme } from '@theme';
import { ReactNode } from 'react';

const containerStyle = css({
  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
});

const MainContainer = ({ children }: { children: ReactNode }) => {
  return <main css={containerStyle}>{children}</main>;
};

export default MainContainer;
