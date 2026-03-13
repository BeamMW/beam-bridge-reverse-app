import React from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  variant?: 'amount' | 'common' | 'fee',
  valid?: boolean;
  value?: string;
  label?: string;
  currencyLabel?: string;
  onChangeHandler?: (value: string) => void;
}

const ContainerStyled = styled.div<{valid: boolean}>`
  margin-top: 12px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.18);
  border-radius: 12px;
  width: 100%;
  height: 44px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 14px;
  border: 1px solid;
  border-color: ${({ valid }) => (valid ? 'rgba(255, 255, 255, 0.12)' : 'var(--color-red)')};
`;

const InputStyled = styled.input<InputProps>`
  line-height: 20px;
  border: none;
  font-size: ${({ variant }) => `${variant === 'common' ? '14px' : '24px'}`};
  color: ${({ variant, valid }) => `${variant === 'common' ? (valid ? 'rgba(255, 255, 255, 0.9)' : 'var(--color-red)') : '#da68f5'}`};
  background-color: transparent;
  width: ${({ variant }) => `${variant === 'common' ? '100%' : '85%'}`};
  height: 100%;
  -moz-appearance:textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    position: absolute;
    top: 0;
    left: 3px;
    line-height: inherit;
    color: rgba(255, 255, 255, 0.6);
    opacity: 0.6;
    font-size: 12px;
    font-style: italic;
  }
`;

const AddressClass = css`
  height: 48px;
`;

const CurrencyLabel = styled.div`
  margin-left: auto;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const LabelStyled = styled.div<InputProps>`
  text-align: start;
  margin-top: 6px;
  font-family: SFProDisplay;
  font-size: 12px;
  margin-left: 15px;
  font-style: italic;
  color: ${({ valid }) => (valid ? 'rgba(255, 255, 255, .7)' : 'var(--color-red)')};
`;

export const AMOUNT_MAX = 253999999.9999999;
const REG_AMOUNT = /^(?!0\d)(\d+)(\.)?(\d{0,8})?$/;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, label, valid = true, value, currencyLabel, onChangeHandler, error, ...rest }, ref) => {
    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const { value: raw } = event.target;
  
      if (variant == 'amount') {
        if ((raw !== '' && !REG_AMOUNT.test(raw)) || parseFloat(raw) > AMOUNT_MAX) {
          return;
        }
      }
  
      onChangeHandler?.(raw);
    };

    return (
      <>
        <ContainerStyled valid={valid} className={variant === 'amount' ? AddressClass : null}>
          <InputStyled
            valid={valid}
            value={value}
            variant={variant} ref={ref} 
            onInput={handleInput}
            error={error} {...rest} />
          {variant === 'amount' && <CurrencyLabel>{currencyLabel || 'BEAM'}</CurrencyLabel>}
        </ContainerStyled>
        {label && <LabelStyled valid={valid}>{!valid ? label : ''}</LabelStyled>}
      </>  
    );
  },
);

export default Input;
