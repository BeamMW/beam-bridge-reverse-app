import React, { useRef } from 'react';
import { styled } from '@linaria/react';
import Utils from '@core/utils.js';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectPopupsState } from '@app/containers/Main/store/selectors';
import { DepositPopup, WithdrawPopup } from './';
import { setPopupState } from '@app/containers/Main/store/actions';
import { css } from '@linaria/core';

interface WindowProps {
  onPrevious?: React.MouseEventHandler | undefined;
}

const Container = styled.div<{ bgColor: string }>`
  background-color: ${({ bgColor }) => Utils.isWeb() ? bgColor : 'transparent'};
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const StyledTitle = styled.div`
  font-weight: 500;
  font-size: 36px;
  margin-bottom: 20px;

  > .controls {
    height: 36px;
    position: absolute !important;
    right: 40px !important;
    top: 37px !important;
    display: flex;
    align-items: flex-end;

    > .new-button-class {
      max-width: 230px !important;
      margin-bottom: 0 !important;
      margin-right: 30px !important;
    }  
  }
`;

const TitleValue = styled.span`
  cursor: pointer;
`;

const BackStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 5px;
  font-weight: bold;
  font-size: 14px;

  > .control {
    cursor: pointer;
  }

  > .control .control-text {
    margin-left: 15px;
  }
`;

const PkeyButtonClass = css`
  margin: 0 !important;
  min-width: 150px;
  text-align: end;
  font-weight: 400 !important;
  display: flex;
  font-size: 16px !important;
`;

const NewButtonClass = css`
  margin-bottom: 0 !important;
  margin-right: 30px !important;
`;

const Window: React.FC<WindowProps> = ({
  children,
  onPrevious
}) => {
  const navigate = useNavigate();
  const rootRef = useRef();
  const dispatch = useDispatch();

  const popupsState = useSelector(selectPopupsState());
  
  return (
    <>
      <Container bgColor={Utils.getStyles().background_main} ref={rootRef}>
        { children }
      </Container>

      <DepositPopup visible={popupsState.deposit} onCancel={()=>{
        dispatch(setPopupState({type: 'deposit', state: false}));
      }}/>
      <WithdrawPopup visible={popupsState.withdraw} onCancel={()=>{
        dispatch(setPopupState({type: 'withdraw', state: false}));
      }}/>
    </>
  );
};

export default Window;
