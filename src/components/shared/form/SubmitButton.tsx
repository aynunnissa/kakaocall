import { css } from '@emotion/react';
import { theme } from '@theme';

const submitButtonStyle = css({
  border: 'none',
  width: '100%',
  margin: `${theme.spacing.lg} 0`,
  padding: `${theme.spacing.md}`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: theme.shape.rounded.lg,
  cursor: 'pointer',

  '&.btn-disabled': {
    cursor: 'not-allowed',
    backgroundColor: theme.palette.grey[300],
  },
});

interface IProps {
  text: string;
  isDisabled: boolean;
  isSubmitting: boolean;
}

const SubmitButton = ({ text, isDisabled, isSubmitting }: IProps) => {
  return (
    <div>
      <button
        css={submitButtonStyle}
        className={`${isDisabled || isSubmitting ? 'btn-disabled' : ''}`}
        disabled={isDisabled}
        aria-label={text}
        type="submit"
      >
        {isSubmitting ? 'Submitting...' : text}
      </button>
    </div>
  );
};

export default SubmitButton;
