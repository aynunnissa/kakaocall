import { css } from '@emotion/react';
import { theme } from '@theme';

/**
 * Style to handle header row on medium screen size
 */
const gridContainer = css({
  display: 'none',

  [theme.breakpoints.sm]: {
    display: 'grid',
    columnGap: theme.spacing.md,
    gridTemplateColumns:
      '[avatar] 4.5rem [contact] 3fr [phone] 2fr [actions] 3fr',
    alignItems: 'center',
    textAlign: 'left',
    fontSize: theme.text.md,
    color: theme.palette.grey[400],
    fontWeight: 500,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    marginBottom: theme.spacing.lg,
  },
});

const ContactHeaderDesktop = () => {
  return (
    <div css={gridContainer}>
      <div></div>
      <p>Name</p>
      <p>Phone Number</p>
      <div></div>
    </div>
  );
};

export default ContactHeaderDesktop;
