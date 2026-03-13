import React from 'react';
import { styled } from '@linaria/react';
import { ButtonVariant, Pallete } from '@core/types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.FC;
  pallete?: Pallete;
  variant?: ButtonVariant;
}

const BaseButtonStyled = styled.button<ButtonProps>`
  &[disabled] {
    opacity: 0.5;

    &:hover,
    &:active {
      box-shadow: none !important;
      cursor: not-allowed !important;
    }
  }
`;

const ButtonStyled = styled(BaseButtonStyled)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  min-width: 180px;
  margin: 0;
  padding: 10px 20px;
  border: none;
  border-radius: 14px;
  background-color: ${({ pallete }) => `var(--color-${pallete})`};
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.3px;
  color: var(--color-dark-blue);

  &:hover,
  &:active {
    filter: brightness(1.05);
    cursor: pointer;
  }

  > svg {
    vertical-align: middle;
    margin-right: 10px;
  }
`;

const GhostBorderedButtonStyled = styled(ButtonStyled)`
  background-color: rgba(0, 246, 210, .1);
  color: ${({ pallete }) => `var(--color-${pallete})`};
  border: ${({ pallete }) => `1px solid var(--color-${pallete})`};
  min-width: 160px;
  padding: 8px 16px;

  &:hover,
  &:active {
    background-color: rgba(0, 246, 210, 0.3);
  }

  > svg {
    vertical-align: middle;
    margin-right: 10px;
  }
`;

const GhostButtonStyled = styled(ButtonStyled)`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;

  &:hover,
  &:active {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const BlockButtonStyled = styled(GhostButtonStyled)`
  width: 100%;
  max-width: none;
  padding: 16px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.04);
  font-size: 12px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: ${({ pallete }) => `var(--color-${pallete})`};

  &:hover,
  &:active {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
`;

const IconButtonStyled = styled(BaseButtonStyled)`
  display: inline-block;
  vertical-align: sub;
  margin: 0 10px;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ pallete }) => `var(--color-${pallete})`};

  > svg {
    vertical-align: middle;
  }
`;

const LinkButtonStyled = styled(IconButtonStyled)`
  margin: 20px 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ pallete }) => `var(--color-${pallete})`};

  > svg {
    vertical-align: middle;
    margin-right: 10px;
  }
`;

const VARIANTS = {
  regular: ButtonStyled,
  ghost: GhostButtonStyled,
  ghostBordered: GhostBorderedButtonStyled,
  link: LinkButtonStyled,
  icon: IconButtonStyled,
  block: BlockButtonStyled,
};

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  pallete = 'green',
  variant = 'regular',
  icon: IconComponent,
  children,
  ...rest
}) => {
  const ButtonComponent = VARIANTS[variant];

  return (
    <ButtonComponent type={type} pallete={pallete} {...rest}>
      {!!IconComponent && <IconComponent />}
      {children}
    </ButtonComponent>
  );
};

export default Button;
