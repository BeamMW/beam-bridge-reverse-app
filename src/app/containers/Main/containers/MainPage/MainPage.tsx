import React from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Window, Button, Table, Rate } from '@app/shared/components';
import { selectBridgeTransactions, selectRates } from '../../store/selectors';
import { IconSend, IconReceive } from '@app/shared/icons';
import { BEAM, NETWORKS_BY_ID, ROUTES } from '@app/shared/constants';
import { BridgeTransaction } from '@core/types';
import { IconConfirm } from '@app/shared/icons';
import { Receive } from '@core/beamAPI';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;
`;

const RateStyleClass = css`
  font-size: 12px;
  align-self: start;
`;

const StyledControls = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: row;
`;

const StyledTable = styled.div`
  margin-top: 30px;
  border-radius: 10px;
  overflow: hidden;
`;

const receiveButtonClass = css`
    margin-left: 20px !important;
`;

const EmptyTableContent = styled.div`
  text-align: center;
  margin-top: 72px;
  font-size: 14px;
  font-style: italic;
  color: #8da1ad;
`;

const ConfirmReceive = styled.div<{disabled?: boolean}>`
  width: 167px;
  height: 32px;
  padding: 8px 16px;
  border-radius: 17.5px;
  border: solid 1px #0bccf7;
  background-color: rgba(11, 204, 247, 0.1);
  color: #0bccf7;
  text-align: center;
  font-size: 14px;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  opacity: ${({ disabled }) => disabled ? "0.5" : ""};
  display: flex;
  flex-direction: row;

  &:hover,
  &:active {
    box-shadow: ${({ disabled }) => disabled ? "none" : "0 0 8px white"};
  }

  > .text {
    margin: 0 auto;
    display: flex;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }
`;

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const rates = useSelector(selectRates());
  const bridgeTransactions = useSelector(selectBridgeTransactions());

  const TABLE_CONFIG = [
    {
      name: 'amount',
      title: 'Amount',
      fn: (value: string, tr: BridgeTransaction) => {
        // const curr = CURRENCIES.find((item) => item.cid === tr.cid);
        const val = parseInt(value) / Math.pow(10, BEAM.decimals);
        const stringVal = val.toFixed(BEAM.validator_dec).replace(/\.?0+$/,"") + ' ' + BEAM.name;

        return (
          <>
            <span>{stringVal}</span>
            <Rate
              value={val}
              selectedCurrencyId={BEAM.rate_id}
              className={RateStyleClass}
            />
          </>
        );
      }
    },
    {
      name: 'status',
      title: 'Status',
      fn: (value: any, tr: BridgeTransaction, index: number) => {
        return (
          <ConfirmReceive 
            onClick={() => handleReceiveTrClick(value, tr, index)}
          >
            <div className='text'><IconConfirm/>withdraw</div>
          </ConfirmReceive>
        )
      }
    },
    {
      name: 'network',
      title: 'From Network',
      fn: (value: any, tr: BridgeTransaction, index: number) => {
        return (
          <div> 
            {NETWORKS_BY_ID[tr.networkId].name}
          </div>
        )
      }
    }
  ];

  const handleSendClick: React.MouseEventHandler = () => {
    navigate(ROUTES.MAIN.SEND);
  };
  
  const handleReceiveClick: React.MouseEventHandler = () => {
    navigate(ROUTES.MAIN.RECEIVE);
  };

  const handleReceiveTrClick = (value, tr, index: number) => {
    Receive(tr);
  };

  const isDisabled = () => {
    return !rates;
  }

  return (
    <Window>
      <Container>
        <StyledControls>
          <Button
            icon={IconSend}
            pallete="purple"
            disabled={isDisabled()}
            onClick={handleSendClick}
          >
            BEAM ={'>'} WBEAM (Ethereum)
          </Button>

          <Button
            icon={IconReceive}
            className={receiveButtonClass}
            pallete="blue"
            onClick={handleReceiveClick}
          >
            WBEAM (Ethereum) ={'>'} BEAM
          </Button>
        </StyledControls>

        <StyledTable>
          <Table config={TABLE_CONFIG} data={bridgeTransactions} keyBy='MsgId'/>
          { bridgeTransactions.length === 0 && (
            <EmptyTableContent>There are no incoming transactions yet</EmptyTableContent>
          )}
        </StyledTable>
      </Container>
    </Window>
  );
};

export default MainPage;
