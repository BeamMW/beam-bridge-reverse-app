import React from 'react';
import { styled } from '@linaria/react';

import { getSign, toUSD } from '@core/appUtils';
import { useSelector } from 'react-redux';
import { selectRates } from '@app/containers/Main/store/selectors';

interface Props {
  value: number;
  income?: boolean;
  className?: string;
  selectedCurrencyId?: string;
}

const RateStyled = styled.div`
  margin-top: 4px;
  color: var(--color-gray);
`;

const Rate: React.FC<Props> = ({
  value, income, className, selectedCurrencyId
}) => {
  const rates = useSelector(selectRates());
  if (!selectedCurrencyId) {
    return null;
  }

  const sign = income ? getSign(income) : '';
  const amount = value;

  return (
    <RateStyled className={className}>
      {sign}
      {toUSD(amount, rates?.[selectedCurrencyId]?.usd ?? 0)}
    </RateStyled>
  );
};

export default Rate;
