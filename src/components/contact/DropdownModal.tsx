import { css } from '@emotion/react';
import { theme } from '@theme';

import { ReactNode } from 'react';

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

const DropdownModal = ({ children }: { children: ReactNode }) => {
  return <ul css={menuContainer}>{children}</ul>;
};

export default DropdownModal;
