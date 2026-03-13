import React from 'react';
import { styled } from '@linaria/react';
import Utils from '@core/utils.js';
import { Selector } from './Selector';

const Container = styled.div<{ bgColor: string }>`
  background-color: ${({ bgColor }) => Utils.isWeb() ? bgColor : 'transparent'};
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
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
