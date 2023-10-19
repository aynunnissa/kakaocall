/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { theme } from '../../theme/theme';

interface ICustomClass {
  [key: string]: string;
}

interface IProps {
  customClass: ICustomClass;
}

const shimmer = keyframes`
    0% {
        background-position: -450px;
    }
    100% {
        background-position: 450px;
    }
`;

const SkeletonBaseStyle = css({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.rounded.xl,
  position: 'relative',
  overflow: 'hidden',

  '&:before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: `linear-gradient(
		to right,
		#e7e7e7 0%,
		#cfcfcf 20%,
		#e7e7e7 40%,
		#e7e7e7 100%
	)`,
    backgroundSize: '450px 400px',
    backgroundRepeat: 'no-repeat',
    animation: `${shimmer} 1s linear infinite`,
  },
});

const Skeleton = ({ customClass }: IProps) => {
  console.log(customClass);
  const SkeletonStyle = css(SkeletonBaseStyle, {
    ...customClass,
  });
  return <div css={SkeletonStyle}></div>;
};

export default Skeleton;
