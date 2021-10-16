import styled, { css } from 'styled-components';

const TinyImg = styled.img<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
    `}
`;

const TinyLogo = ({
  logo,
  onClick,
  size = 14,
}: {
  logo: string;
  onClick: any;
  size?: number;
}) => <TinyImg src={logo} onClick={onClick} size={size} />;

export default TinyLogo;
