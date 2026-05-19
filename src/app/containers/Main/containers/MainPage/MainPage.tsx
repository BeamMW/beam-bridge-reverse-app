import React from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Window, Button, Table, Rate, Panel, BeamMark, BridgeArrow, NetworkIcon } from '@app/shared/components';
import { selectBridgeTransactions, selectRates } from '../../store/selectors';
import { IconSend, IconReceive } from '@app/shared/icons';
import { BEAM, NETWORKS_BY_ID, ROUTES } from '@app/shared/constants';
import { BridgeTransaction } from '@core/types';
import { IconConfirm } from '@app/shared/icons';
import { Receive } from '@core/beamAPI';
import { selectActiveNetwork } from '@app/shared/store/selectors';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 1120px;
  margin: 0 auto;
`;

const RateStyleClass = css`
  font-size: 12px;
  align-self: start;
`;

const BridgeLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const BridgePart = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  line-height: 1;
`;

const BridgeIconClass = css`
  width: 16px;
  height: 16px;
  display: block;
`;

const BridgeArrowClass = css`
  width: 14px;
  height: 14px;
  display: block;
`;

const ActionButtonClass = css`
  @media (max-width: 640px) {
    width: min(360px, 100%);
    min-width: 0;
    margin-left: auto;
    margin-right: auto;
  }
`;

const StyledControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ControlItem = styled.div`
  display: contents;
`;

const EmptyTableContent = styled.div`
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
`;

const ConfirmReceive = styled.div`
  width: 148px;
  height: 28px;
  padding: 6px 12px;
  border-radius: 999px;
  border: solid 1px rgba(11, 204, 247, 0.5);
  background-color: rgba(11, 204, 247, 0.08);
  color: rgba(11, 204, 247, 0.9);
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  opacity: 1;
  display: flex;
  flex-direction: row;

  &:hover,
  &:active {
    box-shadow: 0 0 6px rgba(11, 204, 247, 0.4);
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

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const SectionSubtitle = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const rates = useSelector(selectRates());
  const bridgeTransactions = useSelector(selectBridgeTransactions());
  const activeNetwork = useSelector(selectActiveNetwork());

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
      fn: (_value: any, tr: BridgeTransaction) => {
        return (
          <ConfirmReceive 
            onClick={() => handleReceiveTrClick(tr)}
          >
            <div className='text'><IconConfirm/>withdraw</div>
          </ConfirmReceive>
        )
      }
    },
    {
      name: 'network',
      title: 'From Network',
      fn: (_value: any, tr: BridgeTransaction) => {
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

  const handleReceiveTrClick = (tr: BridgeTransaction) => {
    Receive(tr);
  };

  const isDisabled = () => {
    return !rates;
  }

  return (
    <Window>
      <Container>
        <StyledControls>
          <ControlItem>
            <Button
              icon={IconSend}
              pallete="purple"
              disabled={isDisabled()}
              onClick={handleSendClick}
              className={ActionButtonClass}
            >
              <span>Send</span>
            </Button>
          </ControlItem>

          <ControlItem>
            <Button
              icon={IconReceive}
              pallete="blue"
              onClick={handleReceiveClick}
              className={ActionButtonClass}
            >
              <span>Receive</span>
            </Button>
          </ControlItem>
        </StyledControls>

        <Panel>
          <SectionHeader>
            <SectionTitle>Recent activity</SectionTitle>
            <SectionSubtitle>Incoming bridge transactions</SectionSubtitle>
          </SectionHeader>
          <Table config={TABLE_CONFIG} data={bridgeTransactions} />
          { bridgeTransactions.length === 0 && (
            <EmptyTableContent>There are no incoming transactions yet</EmptyTableContent>
          )}
        </Panel>
      </Container>
    </Window>
  );
};

export default MainPage;
