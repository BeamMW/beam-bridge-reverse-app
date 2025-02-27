import React, { useState, useRef } from 'react';
import { styled } from '@linaria/react';
import { Button, Window } from '@app/shared/components';
import { css } from '@linaria/core';
import { BEAM, DEFAULT_NETWORK_ID, NETWORKS_BY_ID, ROUTES } from '@app/shared/constants';
import { IconCancel, 
  IconCopyWhite,
  IconDai,
  IconEth,
  IconUsdt,
  IconWbtc,
  IconBeam,
  IconArrowManual,
  IconLink } from '@app/shared/icons';
import { useEffect } from 'react';
import { loadPublicKey } from '@core/beamAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { selectActiveNetwork } from '@app/shared/store/selectors';

interface CopyAreaProps {
  onCopy?: any;
}

interface BackDropProps {
  onCancel?: React.MouseEventHandler;
}

const OrSeparator: React.FC<BackDropProps> = ({}) => {
  const StyledOrSeparator = styled.span`
    display: flex;
    flex-direction: row;
    margin: 20px 0;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  `;

  const Text = styled.span`
    font-size: 16px;
    font-style: italic;  
    color: rgba(255, 255, 255, 0.7);
  `;

  const Line = styled.span`
    height: 1px;
    width: 202px;
    background-color: rgba(255, 255, 255, 0.1);
  `;

  return (
    <StyledOrSeparator>
      <Line/>
      <Text>or</Text>
      <Line/>
    </StyledOrSeparator>
  );
};

const CopyArea: React.FC<CopyAreaProps> = ({
  onCopy,
  children,
}) => {
  const StyledArea = styled.div`
    padding: 8px 10px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.05);
    margin-top: 10px;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    max-width: 480px;
  `;

  const Content = styled.div`
    margin-right: 20px;
    font-size: 14px;
    font-style: italic;
    color: #b7c1cb;
    max-width: 424px;
    word-break: break-word;
  `;

  const CopyClass = css`
    cursor: pointer;
  `;

  const handleCopyClick = () => {
    const dataToCopy = onCopy();
    const el = document.createElement('textarea');
    el.value = dataToCopy;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    toast('Copied to clipboard');
  }

  return (
    <StyledArea>
      <Content>{children}</Content>
      <IconCopyWhite className={CopyClass} onClick={handleCopyClick}/>
    </StyledArea>
  );
};

const ReceiveStyled = styled.div`
  width: 580px;
  margin: 0 auto !important;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 4px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 50px;
  margin-top: 32px;
  > .automatic-title {
    font-weight: 700;
    font-size: 14px;

    > .content {
      letter-spacing: 2.625px;
    }

    > .info {
      letter-spacing: 1px;
    }
  }

  > .eth-link {
    display: flex;
    margin-top: 20px;
    cursor: pointer;

    > .text {
      font-style: italic;
      font-weight: 500;
      font-size: 16px;
      color: #00F6D2;
      margin-left: 10px;
      text-decoration: none;
    }
  }

  > .link-info {
    font-style: italic;
    font-weight: 400;
    font-size: 14px;
    color: #B7C1CB;
    margin-top: 7px;
  }

  > .manual-expand {
    display: flex;
    cursor: pointer;

    > .text-expand {
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 2.625px;
      opacity: 0.5;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    > .icon-expand {
      margin-left: auto;
    }

    > .icon-expand.expanded {
      transform: rotate(180deg);
    }
  }
`;

const Subtitle = styled.div`
  opacity: 0.7;
  font-size: 16px;
  font-style: italic;
  text-align: center;
`;

const StyledSeparator = styled.div`
  height: 1px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  margin-top: 50px;
  margin-bottom: 40px;
`;

const ContainerLine = styled.p`
  color: rgba(255, 255, 255, .7);
  font-size: 16px;
  font-style: italic;
`;

const BoldClass = css`
  font-weight: bold;
`;

const IndentClass = css`
  margin-top: 20px;
`;

const SmallIndentClass = css`
  margin-top: 10px;
`;

const pTitle = css`
  color: rgba(255, 255, 255, 1) !important;
  font-weight: bold;
`;

const LinkClass = css`
  color: #00f6d2;
  text-decoration: none;
  font-weight: bold
  margin-left: 4px;
`;

const CancelButtonClass = css`
  margin-top: 30px !important;
  margin-bottom: 50px !important;
  max-width: 133px !important;
`;

const ExpandedContent = styled.div`
  margin-top: 20px;

  > .sub-link {
    margin-top: 10px;
  }
`;

const Receive = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fullLink, setFullLink] = useState<string>();
  const [fullAddress, setFullAddress] = useState<string>();
  const navigate = useNavigate();
  const activeNetwork = useSelector(selectActiveNetwork());

  // const tmplink = "https://beam-to-eth-bridge.beam.mw/";

  useEffect(() => {
    const address = `${NETWORKS_BY_ID[activeNetwork.network]?.indicator}${activeNetwork.pk}`;
    setFullAddress(address);
    setFullLink(`${process.env.API_URL}/send/${address}`);
  }, [activeNetwork]);

  const cancelClicked = () => {
    navigate(ROUTES.MAIN.MAIN_PAGE);
  }

  const onExpandClicked = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <Window>
      <ReceiveStyled>
        <Title>
          WBEAM ({NETWORKS_BY_ID[activeNetwork.network]?.name}) ={'>'} BEAM
        </Title>
        <Container>
          <div className='automatic-title'>
            <span className='content'>AUTOMATIC WAY</span>
            <span className='info'>(recommended)</span>
          </div>
          <div className='eth-link'>
            <IconLink/>
            <a className='text' href={fullLink} target="_blank">
              {NETWORKS_BY_ID[activeNetwork.network]?.name} side of the bridge
            </a>
          </div>
          <div className='link-info'>(your Beam bridge address will be pasted automatically)</div>

          <OrSeparator/>

          <div className='manual-expand' onClick={onExpandClicked}>
            <span className='text-expand'>MANUAL WAY TO THE BRIDGE</span>
            <IconArrowManual className={'icon-expand ' + (isExpanded ? 'expanded' : '')}/>
          </div>

          { isExpanded && (
            <ExpandedContent>
              <ContainerLine>
                - Copy and open <span className={pTitle}>{NETWORKS_BY_ID[activeNetwork.network]?.name} side of the brige </span> 
                manually in your web browser
              </ContainerLine>
              <CopyArea onCopy={()=> `${process.env.API_URL}/send/`}>
                {`${process.env.API_URL}/send/`}
              </CopyArea>
              <ContainerLine className='sub-link'>
                - Select <span className={pTitle}>{NETWORKS_BY_ID[activeNetwork.network]?.name} to BEAM </span>
              </ContainerLine>
              <ContainerLine>
                - Copy and paste this address to the Beam bridge address field
              </ContainerLine>
              <CopyArea onCopy={()=> (fullAddress)}>
                {fullAddress}
              </CopyArea>
            </ExpandedContent>
          )}
        </Container>

        <Button
          variant="ghost" 
          onClick={cancelClicked} 
          className={CancelButtonClass} 
          pallete="purple" 
          icon={IconCancel}
        >
          close
        </Button>
      </ReceiveStyled>
    </Window>
  );
};

export default Receive;
