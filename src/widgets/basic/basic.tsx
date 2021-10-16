import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  flex-direction: column;
`;

const Column = styled(Flex)``;

const Row = styled(Flex)`
  flex-direction: row;
`;

const Center = styled(Flex)({
  justifyContent: 'center',
  alignItems: 'center',
});

const _formatSize = (val: any) =>
  (typeof val === 'number' ? `${val}px` : val) || 0;

const SizedBox = styled.div<{
  width?: number | string;
  height?: number | string;
}>`
  ${({ width }) => width && `width: ${_formatSize(width)}`}
  ${({ height }) => height && `height: ${_formatSize(height)}`}
`;

const SmallestRoundedWidget = styled(Column)`
  width: 120px;
  height: 120px;
  padding: 16px;
  border-radius: 24px;
  background-color: #202020;
  color: #f0f0f0;
`;

export { Flex, Column, Row, Center, SizedBox, SmallestRoundedWidget };
