import { css } from '@emotion/react';
import { theme } from '@theme';
import { ChangeEvent } from 'react';

const inputContainer = css({
  position: 'relative',
  border: 'none',
  flexGrow: 1,
});

const inputIcon = css({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: theme.spacing.sm,
  // temp
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: 'pink',
});

const inputField = css({
  padding: `${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.xl}`,
  outline: 'none',
  border: 'none',
  borderRadius: theme.shape.rounded.md,
  backgroundColor: theme.palette.grey[100],
  width: '100%',
  boxSizing: 'border-box',
});

interface IProps {
  onSearch: (query: string) => void;
}

const SearchContact = ({ onSearch }: IProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div css={inputContainer}>
      <span css={inputIcon}></span>
      <input
        type="text"
        name="searchContact"
        css={inputField}
        placeholder="Search contact name..."
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchContact;
