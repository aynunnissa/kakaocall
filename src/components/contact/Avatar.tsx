import { css } from '@emotion/react';
import { theme } from '@theme';

const avatarStyle = css({
  borderRadius: theme.shape.circle,
  height: '4.5rem',
  width: '4.5rem',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: theme.text.md,
  color: 'white',
});

interface IProps {
  initial: string;
}

function stringToHslColor(word: string) {
  let hash = 0;
  hash = word.charCodeAt(0) + ((hash << 5) - hash);

  const h = (hash % 360) + 100;
  return 'hsl(' + h + ', 70%, 35%)';
}

const Avatar = ({ initial }: IProps) => {
  const avatarColor = css(avatarStyle, {
    backgroundColor: stringToHslColor(initial),
  });
  return (
    <div css={avatarColor}>
      <span>{initial}</span>
    </div>
  );
};

export default Avatar;
