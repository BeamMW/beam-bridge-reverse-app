import React, { useMemo, useState } from 'react';
import { styled } from '@linaria/react';
import { BeamMark, BridgeArrow, NetworkIcon, Panel, Window } from '@app/shared/components';
import { css } from '@linaria/core';
import { NETWORKS_BY_ID, ROUTES } from '@app/shared/constants';
import {
  IconCopyWhite,
  IconArrowManual,
  IconLink } from '@app/shared/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { selectActiveNetwork } from '@app/shared/store/selectors';
import { copyToClipboard } from '@core/appUtils';

interface CopyAreaProps {
  onCopy: () => string;
}

const StyledOrSeparator = styled.span`
  display: flex;
  flex-direction: row;
  margin: 16px 0;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const OrSeparatorText = styled.span`
  font-size: 13px;
  font-style: italic;  
  color: rgba(255, 255, 255, 0.6);
`;

const OrSeparatorLine = styled.span`
  height: 1px;
  width: 170px;
  background-color: rgba(255, 255, 255, 0.08);
`;

const OrSeparator: React.FC = () => {
  return (
    <StyledOrSeparator>
      <OrSeparatorLine/>
      <OrSeparatorText>or</OrSeparatorText>
      <OrSeparatorLine/>
    </StyledOrSeparator>
  );
};

const StyledArea = styled.div`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.18);
  margin-top: 8px;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  max-width: 480px;
`;

const CopyContent = styled.div`
  margin-right: 16px;
  font-size: 13px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  max-width: 420px;
  word-break: break-word;
`;

const CopyClass = css`
  cursor: pointer;
`;

const CopyArea: React.FC<CopyAreaProps> = ({
  onCopy,
  children,
}) => {
  const handleCopyClick = () => {
    const dataToCopy = onCopy();
    if (dataToCopy) {
      copyToClipboard(dataToCopy);
      toast('Copied to clipboard');
    }
  }

  return (
    <StyledArea>
      <CopyContent>{children}</CopyContent>
      <IconCopyWhite className={CopyClass} onClick={handleCopyClick}/>
    </StyledArea>
  );
};

const ReceiveStyled = styled.div`
  width: 100%;
  max-width: 640px;
  margin: 0 auto !important;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 640px) {
    padding-left: 8px;
    padding-right: 8px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 0;
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 16px 0;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 14px;
  line-height: 1;

  &::before {
    content: '←';
    opacity: 0.9;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0.5px);
  }
`;

const Container = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  > .automatic-title {
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2.2px;
    color: rgba(255, 255, 255, 0.7);

    > .content {
      letter-spacing: 2.2px;
    }

    > .info {
      letter-spacing: 1px;
      opacity: 0.6;
      margin-left: 6px;
    }
  }

  > .eth-link {
    display: flex;
    margin-top: 6px;
    cursor: pointer;

    > .text {
      font-style: italic;
      font-weight: 600;
      font-size: 14px;
      color: #00F6D2;
      margin-left: 10px;
      text-decoration: none;
    }
  }

  > .eth-link.disabled {
    cursor: default;
    opacity: 0.6;

    > .text {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  > .link-info {
    font-style: italic;
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0;
  }

  > .manual-expand {
    display: flex;
    cursor: pointer;

    > .text-expand {
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 2px;
      opacity: 0.5;
    }

    > .icon-expand {
      margin-left: auto;
    }

    > .icon-expand.expanded {
      transform: rotate(180deg);
    }
  }
`;

const ContainerLine = styled.p`
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  font-style: italic;
`;

const TitleBridgeLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const TitleBridgePart = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 1;
`;

const TitleTokenLabel = styled.span`
  letter-spacing: 0.6px;
  padding: 0 4px;
`;

const TitleIconClass = css`
  width: 18px;
  height: 18px;
  display: block;
`;

const TitleArrowClass = css`
  width: 14px;
  height: 14px;
  display: block;
`;

const pTitle = css`
  color: rgba(255, 255, 255, 1) !important;
  font-weight: bold;
`;

const ExpandedContent = styled.div`
  margin-top: 12px;

  > .sub-link {
    margin-top: 10px;
  }
`;

const Receive = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const activeNetwork = useSelector(selectActiveNetwork());
  const networkName = NETWORKS_BY_ID[activeNetwork.network]?.name ?? 'Network';
  const apiUrl = (process.env.API_URL || '').trim().replace(/\/$/, '');
  const hasApiUrl = Boolean(apiUrl);

  const { fullAddress, fullLink, manualLink } = useMemo(() => {
    const indicator = NETWORKS_BY_ID[activeNetwork.network]?.indicator ?? '';
    const pk = activeNetwork?.pk ?? '';
    const address = indicator && pk ? `${indicator}${pk}` : '';
    return {
      fullAddress: address,
      fullLink: hasApiUrl && address ? `${apiUrl}/send/${address}` : '',
      manualLink: hasApiUrl ? `${apiUrl}/send/` : '',
    };
  }, [activeNetwork, apiUrl, hasApiUrl]);

  const onExpandClicked = () => {
    setIsExpanded((prev) => !prev);
  }

  return (
    <Window>
      <ReceiveStyled>
        <HeaderRow>
          <TitleBlock>
            <PageTitle>
              <TitleBridgeLabel>
                <TitleBridgePart>
                  <TitleTokenLabel>WBEAM</TitleTokenLabel>
                  <NetworkIcon chainId={activeNetwork.network} className={TitleIconClass} />
                </TitleBridgePart>
                <BridgeArrow className={TitleArrowClass} />
                <TitleBridgePart>
                  <TitleTokenLabel>BEAM</TitleTokenLabel>
                  <BeamMark className={TitleIconClass} />
                </TitleBridgePart>
              </TitleBridgeLabel>
            </PageTitle>
            <PageSubtitle>Copy your {networkName} bridge address and paste it into Beam Wallet.</PageSubtitle>
          </TitleBlock>
          <BackButton type="button" onClick={() => navigate(ROUTES.MAIN.MAIN_PAGE)}>
            Back
          </BackButton>
        </HeaderRow>
        <Container>
          <div className='automatic-title'>
            <span className='content'>AUTOMATIC WAY</span>
            <span className='info'>(recommended)</span>
          </div>
          <div className={`eth-link ${hasApiUrl ? '' : 'disabled'}`}>
            <IconLink/>
            {hasApiUrl ? (
              <a className='text' href={fullLink} target="_blank" rel="noreferrer">
                {networkName} side of the bridge
              </a>
            ) : (
              <span className='text'>Bridge URL is not configured.</span>
            )}
          </div>
          <div className='link-info'>
            {hasApiUrl
              ? '(your Beam bridge address will be pasted automatically)'
              : 'Set API_URL to enable the bridge link.'}
          </div>

          <OrSeparator/>

          <div className='manual-expand' onClick={onExpandClicked}>
            <span className='text-expand'>MANUAL WAY TO THE BRIDGE</span>
            <IconArrowManual className={'icon-expand ' + (isExpanded ? 'expanded' : '')}/>
          </div>

          { isExpanded && (
            <ExpandedContent>
              <ContainerLine>
                - Copy and open <span className={pTitle}>{networkName} side of the brige </span> 
                manually in your web browser
              </ContainerLine>
              {hasApiUrl ? (
                <CopyArea onCopy={() => manualLink}>
                  {manualLink}
                </CopyArea>
              ) : (
                <ContainerLine className='sub-link'>
                  Bridge URL is not configured. Set API_URL to enable the manual link.
                </ContainerLine>
              )}
              <ContainerLine className='sub-link'>
                - Select <span className={pTitle}>{networkName} to BEAM </span>
              </ContainerLine>
              <ContainerLine>
                - Copy and paste this address to the Beam bridge address field
              </ContainerLine>
              <CopyArea onCopy={() => fullAddress}>
                {fullAddress}
              </CopyArea>
            </ExpandedContent>
          )}
        </Container>
      </ReceiveStyled>
    </Window>
  );
};

export default Receive;
