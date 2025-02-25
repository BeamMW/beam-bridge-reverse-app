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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface DropdownProps {
  isVisible: boolean
}

interface BackDropProps {
  onCancel?: React.MouseEventHandler;
}

interface SelectorProps {
  onNetworkChanged: (next) => void;
  onPkChanged: (pk) => void;
  className: string;
}

interface CopyAreaProps {
  onCopy?: any;
}

const BackdropStyled = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const BackDrop: React.FC<BackDropProps> = ({
  onCancel,
  children,
}) => {
  const rootRef = useRef();

  const handleOutsideClick = (event) => {
    if (event.target === rootRef.current) {
      onCancel(event);
    }
  };

  return (
    <BackdropStyled ref={rootRef} onClick={handleOutsideClick}>
      { children }
    </BackdropStyled>
  );
};

const Selector: React.FC<SelectorProps> = ({onNetworkChanged, onPkChanged, className}) => {
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!isOpen);
  const [selectedNetwork, setSelectedNetwork] = useState<string>(DEFAULT_NETWORK_ID);
  
  useEffect(() => {
    loadPublicKey(null, BEAM.cid_by_network[selectedNetwork]).then((pk) => {
      onPkChanged(pk);
    });
    onNetworkChanged(selectedNetwork)
  }, [])
  
  const handleNetworkClick = async (id: string) => {
    setSelectedNetwork(id);
    onNetworkChanged(id);
    const pk = await loadPublicKey(null, BEAM.cid_by_network[id]);
    onPkChanged(pk);
    setOpen(false);
  }

  const StyledDropdown = styled.div`
    margin-top: 20px;
  `;

  const DropdownElem = styled.div`
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 234px;
    height: 55px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 15px 24px;
  `;

  const DropdownElemOption = styled.div`
    font-size: 16px;
    padding: 8px 0;
    cursor: pointer;
    font-size: 16px;
    letter-spacing: 0.4px;
    display: flex;
    align-items: center;
  `;

  const DropdownBody = styled.div<DropdownProps>`
    z-index: 100;
    width: 234px;
    border-radius: 10px;
    position: absolute;
    background-color: #1c3a59;
    margin-top: 10px;
    padding: 12px 24px;
    display: ${({ isVisible }) => `${isVisible ? 'block' : 'none'}`};
  `;

  const Triangle = styled.div`
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #8da1ad;
    margin-left: auto;
  `;

  const CurrencyClass = css`
    line-height: 1;
    margin-left: 16px;
  `;

  return (<StyledDropdown className={className}>
    <DropdownElem onClick={toggleDropdown}>
      <span className={CurrencyClass}>{NETWORKS_BY_ID[selectedNetwork].name}</span>
      <Triangle></Triangle>
    </DropdownElem>
    {
      isOpen && (
        <>
          <DropdownBody isVisible={isOpen} className={`dropdown-body ${isOpen && 'open'}`}>
            {Object.entries(NETWORKS_BY_ID).map(([id, data]) => (
              <DropdownElemOption key={id} onClick={e => handleNetworkClick(id)}>
                <span className={CurrencyClass}>
                  {data.name}
                </span>
              </DropdownElemOption>
            ))}
          </DropdownBody>
          <BackDrop onCancel={()=>setOpen(false)}/>
        </>
      )
    }
  </StyledDropdown>);
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

  > .network-selector {
    align-self: center;
  }

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
  const [pKey, setPk] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>();
  const [fullLink, setFullLink] = useState<string>();
  const [fullAddress, setFullAddress] = useState<string>();
  const navigate = useNavigate();

  // const tmplink = "https://beam-to-eth-bridge.beam.mw/";

  useEffect(() => {
    const address = `${NETWORKS_BY_ID[selectedNetwork]?.indicator}${pKey}`;
    setFullAddress(address);
    setFullLink(`${process.env.API_URL}/send/${address}`);
  }, [pKey, selectedNetwork]);

  const pkChanged = (pk) => {
    setPk(pk);
  }

  const networkChanged = (networkId: string) => {
    setSelectedNetwork(networkId);
  }

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
          WBEAM ({NETWORKS_BY_ID[selectedNetwork]?.name}) ={'>'} BEAM
        </Title>
        <Container>
          <Subtitle>Choose network</Subtitle>
          <Selector className='network-selector'
            onNetworkChanged={networkChanged}
            onPkChanged={pkChanged} 
          />

          <StyledSeparator/>

          <div className='automatic-title'>
            <span className='content'>AUTOMATIC WAY</span>
            <span className='info'>(recommended)</span>
          </div>
          <div className='eth-link'>
            <IconLink/>
            <a className='text' href={fullLink} target="_blank">
              Ethereum side of the bridge
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
                - Copy and open <span className={pTitle}>Ethereum side of the brige </span> 
                manually in your web browser
              </ContainerLine>
              <CopyArea onCopy={()=> `${process.env.API_URL}/send/`}>
                {`${process.env.API_URL}/send/`}
              </CopyArea>
              <ContainerLine className='sub-link'>
                - Select <span className={pTitle}>Ethereum to BEAM </span>
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
