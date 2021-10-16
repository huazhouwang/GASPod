import styled from 'styled-components';
import { Column, SizedBox, Row, SmallestRoundedWidget } from '../basic/basic';
import rapidLogo from '../../assets/logo_rapid.svg';
import logoFast from '../../assets/logo_fast.svg';
import logoStandard from '../../assets/logo_standard.svg';

const WidgetContainer = styled(SmallestRoundedWidget)`
  justify-content: space-between;
`;

const PriceContainer = styled(Row)`
  width: 100%;
  height: 48px;
  align-items: center;
`;

const PriceLogo = styled.img`
  width: 32px;
  height: 32px;
`;

const PriceLabel = styled.span`
  font-size: 10px;
  color: #9e9e9e;
`;

const PriceValue = styled.span`
  white-space: pre;
  font-size: 14px;
`;

const Price = ({
  label,
  value,
  logo,
}: {
  label: string;
  value: string;
  logo: string;
}) => (
  <PriceContainer>
    <PriceLogo src={logo} />
    <SizedBox width={16} />
    <Column>
      <PriceValue>{value || '--'} GWEI</PriceValue>
      <PriceLabel>{label}</PriceLabel>
    </Column>
  </PriceContainer>
);

const View = ({
  rapid,
  fast,
  standard,
  onClick,
}: {
  rapid: string;
  fast: string;
  standard: string;
  onClick: () => void;
}) => (
  <WidgetContainer onClick={onClick}>
    <Price label={'~15s'} logo={rapidLogo} value={rapid} />
    <Price label={'~1min'} logo={logoFast} value={fast} />
    <Price label={'~3min'} logo={logoStandard} value={standard} />
  </WidgetContainer>
);

export default View;