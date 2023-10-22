import { useEffect } from 'react';
import { css } from '@emotion/react';
import { createPortal } from 'react-dom';
import { theme } from '@theme';

const ToastStyle = css({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  color: theme.palette.common.white,
  padding: `0 ${theme.spacing.md}`,
  borderRadius: theme.shape.rounded.md,
  boxShadow: theme.shadow.normal,
  fontSize: theme.text.md,

  '.toast-content': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },

  '.toast-close': {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    fontSize: 'inherit',
    cursor: 'pointer',
  },
});

interface IProps {
  text: string;
  variant: 'success' | 'error';
  setOpenToast: (val: boolean) => void;
}

const Toast = ({ text, variant, setOpenToast }: IProps) => {
  const bgColor =
    variant === 'success'
      ? theme.palette.success.main
      : theme.palette.error.main;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenToast(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [setOpenToast]);

  return createPortal(
    <div
      className="toast"
      css={ToastStyle}
      style={{ backgroundColor: bgColor }}
    >
      <div className="toast-content">
        <p>{text}</p>
        <button
          className="toast-close"
          onClick={() => setOpenToast(false)}
          aria-label="Close toast"
        >
          x
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Toast;
