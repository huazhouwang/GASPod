import styled from 'styled-components';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const formatSize = (val: any) =>
  (typeof val === 'number' ? `${val}px` : val) || 0;

const Padding = styled.div<{ width?: any; height?: any }>`
  ${({ width }) => width && `width: ${formatSize(width)}`}
  ${({ height }) => height && `height: ${formatSize(height)}`}
`;

const SmallestRoundedWidget = styled(Column)`
  width: 120px;
  height: 120px;
  padding: 16px;
  border-radius: 24px;
  background-color: #202020;
  color: #f0f0f0;
`;

export { Column, Row, Padding, SmallestRoundedWidget };
