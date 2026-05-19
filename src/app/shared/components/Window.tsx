import React from 'react';
import { styled } from '@linaria/react';
import Utils from '@core/utils.js';
import { Selector } from './Selector';

const Container = styled.div<{ bgColor: string }>`
  background-color: ${({ bgColor }) => Utils.isWeb() ? bgColor : 'transparent'};
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }
`;

const Window: React.FC = ({ children }) => {
  return (
    <Container bgColor={Utils.getStyles().background_main}>
      <Selector />
      { children }
    </Container>
  );
};

export default Window;
