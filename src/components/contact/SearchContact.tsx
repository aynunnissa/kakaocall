import { css } from '@emotion/react';
import { theme } from '@theme';
import { ChangeEvent } from 'react';

const inputContainer = css({
  position: 'relative',
  border: 'none',
  flexGrow: 1,

  '.input-icon': {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: theme.spacing.sm,
    fontWeight: 600,
    fontSize: theme.text.lg,
    color: theme.palette.grey[400],
  },

  '.input-field': {
    padding: `${theme.spacing.md} ${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing['2xl']}`,
    outline: 'none',
    border: 'none',
    borderRadius: theme.shape.rounded.xl,
    backgroundColor: theme.palette.grey[100],
    width: '100%',
    boxSizing: 'border-box',
  },
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
      <span className="kao-search input-icon"></span>
      <input
        type="text"
        name="searchContact"
        className="input-field"
        placeholder="Search contact name..."
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchContact;
