import styled from 'styled-components';
import { Column, Row, SmallestRoundedWidget } from '../basic/basic';
import rapidLogo from '../../assets/logo_rapid.svg';
import logoFast from '../../assets/logo_fast.svg';
import logoStandard from '../../assets/logo_standard.svg';

const PriceList = styled(Column)`
  cursor: pointer;
  justify-content: space-between;
`;

const PriceContainer = styled(Row)`
  width: 100%;
  height: 40px;
  align-items: center;
`;

const PriceLogo = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 8px;
`;

const PriceLabel = styled.span`
  font-size: 10px;
  color: #9e9e9e;
`;

const PriceValue = styled.span`
  white-space: pre;
  font-size: 14px;
`;

const EIP1559FeeContainer = styled(Row)`
  align-items: baseline;
`;

const PriorityFee = styled(PriceValue)`
  font-size: 9px;
`;

const EIP1559StatusContainer = styled(Row)`
  cursor: pointer;
  width: fit-content;
  align-items: center;
  align-self: flex-end;
  margin-top: -6px;
  margin-right: -6px;
  padding: 1px 6px 1px 6px;
  border-radius: 8px;

  &:hover {
    background-color: #424242;
  }
`;

const EIP1559StatusText = styled.span`
  font-size: 9px;
  color: #9e9e9e;
`;

const Price = ({
  label,
  value,
  logo,
}: {
  label: string;
  value: string;
  logo: string;
}) => {
  const isEIP1559 = value && value.indexOf('/') >= 0;
  const legacyPrice = isEIP1559 ? '' : value;
  const [priorityFee, maxFee] = isEIP1559 ? value.split('/') : [];

  return (
    <PriceContainer>
      <PriceLogo src={logo} />
      <Column>
        {isEIP1559 ? (
          <EIP1559FeeContainer>
            <PriceValue>{maxFee}</PriceValue>
            <PriorityFee> {priorityFee}</PriorityFee>
          </EIP1559FeeContainer>
        ) : (
          <PriceValue>{legacyPrice || '--'}</PriceValue>
        )}
        <PriceLabel>{label}</PriceLabel>
      </Column>
    </PriceContainer>
  );
};

const EIP1559Status = ({
  eip1559Enabled,
  switchEIP1559Enabled,
}: {
  eip1559Enabled: boolean;
  switchEIP1559Enabled: () => void;
}) => {
  return (
    <EIP1559StatusContainer onClick={switchEIP1559Enabled}>
      <EIP1559StatusText>
        {eip1559Enabled ? 'EIP1559' : 'Legacy'}
      </EIP1559StatusText>
    </EIP1559StatusContainer>
  );
};

const View = ({
  eip1559Enabled,
  switchEIP1559Enabled,
  rapid,
  fast,
  standard,
  onClick,
}: {
  eip1559Enabled: boolean;
  switchEIP1559Enabled: () => void;
  rapid: string;
  fast: string;
  standard: string;
  onClick: () => void;
}) => (
  <SmallestRoundedWidget>
    <EIP1559Status
      eip1559Enabled={eip1559Enabled}
      switchEIP1559Enabled={switchEIP1559Enabled}
    />
    <PriceList onClick={onClick}>
      <Price label={'~15s'} logo={rapidLogo} value={rapid} />
      <Price label={'~1min'} logo={logoFast} value={fast} />
      <Price label={'~3min'} logo={logoStandard} value={standard} />
    </PriceList>
  </SmallestRoundedWidget>
);

export default View;
