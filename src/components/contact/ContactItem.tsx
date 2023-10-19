import { IContact } from '@/store/types/contact';
import { css } from '@emotion/react';
import { theme } from '@theme';

const flexContainer = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
});

const contactContainer = css(flexContainer, {
  justifyContent: 'space-between',
});

const avatarStyle = css({
  objectFit: 'cover',
  borderRadius: theme.shape.circle,
  height: '4.5rem',
  width: '4.5rem',
  backgroundColor: 'pink',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
});

const contactText = css({
  margin: 0,
});

const contactName = css(contactText, {
  fontSize: theme.text.md,
  fontWeight: 500,
});

const contactNumber = css(contactText, {
  fontSize: theme.text.xs,
  color: theme.palette.grey[300],
});

const Icon = css({
  // temp
  width: '10px',
  height: '30px',
  backgroundColor: 'pink',
});

const ContactItem = (props: IContact) => {
  return (
    <div css={contactContainer}>
      <div css={flexContainer}>
        <div css={avatarStyle}>{props.first_name.charAt(0)}</div>
        <div>
          <p css={contactName}>
            {props.first_name} {props.last_name}
          </p>
          <p css={contactNumber}>{props.phones?.[0]?.number}</p>
        </div>
      </div>
      <div css={flexContainer}>
        <div css={Icon}></div>
      </div>
    </div>
  );
};

export default ContactItem;
