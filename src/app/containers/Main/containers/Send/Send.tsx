import React, { useEffect, useMemo, useState } from 'react';
import { styled } from '@linaria/react';
import { BeamMark, BridgeArrow, Button, CurrInput, NetworkIcon, Panel, Rate, Window } from '@app/shared/components';
import { css } from '@linaria/core';

import { IconSend } from '@app/shared/icons';
import { useNavigate } from 'react-router-dom';
import { BEAM, CURRENCIES, NETWORKS_BY_ID, ROUTES } from '@app/shared/constants';
import { sendTo } from '@core/beamAPI';
import { utils as ethersUtils } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { selectRates, selectRelayerFees } from '../../store/selectors';
import { loadRelayerFees } from '../../store/actions';
import { selectActiveNetwork } from '@app/shared/store/selectors';
import { Currency } from '@app/containers/Main/interfaces';

interface SendFormData {
  send_amount: string;
  address: string;
}

interface DropdownProps {
  isVisible: boolean
};

interface BackDropProps {
  onCancel?: React.MouseEventHandler;
}

const SendStyled = styled.form`
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

const ControlsStyled = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const SectionPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
`;

const InfoPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContainerLine = styled.p`
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  font-style: italic;
  display: flex;
  flex-direction: row;
  line-height: 1.6;
`;

const Subtitle = styled.p`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
`;

const AmountHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const TokenDropdown = styled.div`
  position: relative;
`;

const TokenDropdownElem = styled.div`
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 220px;
  height: 44px;
  border-radius: 12px;
  background-color: #031e3b;
  padding: 10px 16px;
`;

const TokenDropdownOption = styled.div`
  font-size: 14px;
  padding: 6px 0;
  cursor: pointer;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
`;

const TokenDropdownBody = styled.div<DropdownProps>`
  z-index: 100;
  width: 220px;
  border-radius: 12px;
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #02182f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
  padding: 10px 16px;
  display: ${({ isVisible }) => `${isVisible ? 'block' : 'none'}`};
`;

const TokenTriangle = styled.div`
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(255, 255, 255, 0.5);
  margin-left: auto;
`;

const TokenNameClass = css`
  line-height: 1;
  margin-left: 12px;
`;

const BackdropStyled = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const RateStyleClass = css`
  font-size: 12px;
  align-self: start;
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

const InfoList = styled.div`
  margin-left: 15px;
  line-height: 1.6;
  margin-top: 12px;
`;

const Text = styled.span`
  max-width: 480px;
  word-break: break-word;
`;

const LinkClass = css`
  color: #00f6d2;
  text-decoration: none;
  font-weight: bold;
  margin-left: 4px;
`;

const MissingLinkClass = css`
  color: rgba(255, 255, 255, 0.6);
`;

const TransferButtonClass = css`
  max-width: 180px !important;
  margin: 0 !important;
`;

const pTitle = css`
  color: rgba(255, 255, 255, 1) !important;
  font-weight: bold;
`;

const SendClass = css`
  height: 48px !important;
`;

const AmountContainer = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 6px;
  gap: 16px;
`;

const FeeItem = styled.div`
`;

const FeeValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 8px;
`;

const FormSubtitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  margin-top: 16px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
`;

const FeeSubtitleClass = css`
  margin-top: 0 !important;
`;

const Send = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const relayerFees = useSelector(selectRelayerFees());
  const rates = useSelector(selectRates());
  const activeNetwork = useSelector(selectActiveNetwork());
  const networkName = NETWORKS_BY_ID[activeNetwork.network]?.name ?? 'Network';
  const apiUrl = (process.env.API_URL || '').trim().replace(/\/$/, '');
  const hasApiUrl = Boolean(apiUrl);
  const [values, setValues] = useState<SendFormData>({
    send_amount: '',
    address: '',
  });
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [isCurrencyOpen, setCurrencyOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<SendFormData>>({});
  const isValid = Object.keys(errors).length === 0;
  const hasAmountInput = values.send_amount.length > 0;
  const hasAddressInput = values.address.length > 0;

  const availableCurrencies = useMemo(() => {
    if (!activeNetwork?.network) {
      return [];
    }

    return CURRENCIES.filter((currency) => Boolean(currency.cid_by_network[activeNetwork.network]));
  }, [activeNetwork?.network]);

  useEffect(() => {
    if (!availableCurrencies.length) {
      setSelectedCurrency(null);
      return;
    }

    setSelectedCurrency((current) => {
      if (current && availableCurrencies.some((currency) => currency.rate_id === current.rate_id)) {
        return current;
      }
      return availableCurrencies[0];
    });
  }, [availableCurrencies]);

  useEffect(() => {
    if (rates && selectedCurrency) {
      dispatch(loadRelayerFees.request({
        rates,
        currency: selectedCurrency,
      }));
    }
  }, [dispatch, rates, selectedCurrency]);

  const relayerFeeByNetwork = useMemo(() => {
    const selectedNetworkId = activeNetwork?.network;
    if (!relayerFees || !selectedNetworkId) {
      return undefined;
    }

    const relayerFeeNetworkId = NETWORKS_BY_ID[selectedNetworkId]?.relayerFeeNetworkId;
    const feeValue = relayerFeeNetworkId ? Number(relayerFees[relayerFeeNetworkId]) : undefined;
    return Number.isFinite(feeValue) ? feeValue : undefined;
  }, [relayerFees, activeNetwork?.network]);

  useEffect(() => {
    if (!hasAddressInput && !hasAmountInput) {
      return;
    }
    setErrors(validate(values, { hasAddressInput, hasAmountInput }));
  }, [activeNetwork?.network]);

  const parseBridgeAddress = (rawValue: string) => {
    const trimmed = rawValue.trim();
    if (trimmed.startsWith('0x') && trimmed.length >= 42) {
      return trimmed.slice(0, 42);
    }
    return trimmed;
  };

  const validate = (
    formValues: SendFormData,
    options?: { hasAmountInput?: boolean; hasAddressInput?: boolean },
  ) => {
    const shouldValidateAmount = options?.hasAmountInput ?? hasAmountInput;
    const shouldValidateAddress = options?.hasAddressInput ?? hasAddressInput;
    const errorsValidation: Partial<SendFormData> = {};
    const {
        send_amount,
        address
    } = formValues;

    if (shouldValidateAmount && (!send_amount || parseFloat(send_amount) <= 0)) {
      errorsValidation.send_amount = 'Insufficient amount';
    }

    const addressPart = parseBridgeAddress(address ?? '');
    if (shouldValidateAddress && !ethersUtils.isAddress(addressPart)) {
      errorsValidation.address = 'Unrecognized address';
      return errorsValidation;
    }
    return errorsValidation;
  };

  const isFormDisabled = () => {
    if (!selectedCurrency) return true;
    if (!isValid) return true;
    if (!hasAmountInput || !relayerFeeByNetwork) return true;
    return false;
  };

  const isAddressValid = () => !errors.address;
  const isSendAmountValid = () => !errors.send_amount;
  const toggleCurrencyDropdown = () => setCurrencyOpen(!isCurrencyOpen);

  const handleCurrencyClick = (currency: Currency) => {
    setSelectedCurrency(currency);
    setCurrencyOpen(false);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    if (!activeNetwork?.network || !relayerFeeByNetwork) {
      return;
    }

    const amount = parseFloat(values.send_amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const addressPart = parseBridgeAddress(values.address ?? '');
    if (!ethersUtils.isAddress(addressPart)) {
      return;
    }

    if (!selectedCurrency) {
      return;
    }

    const cid = selectedCurrency.cid_by_network[activeNetwork.network];
    if (!cid) {
      return;
    }

    const sendData = {
      amount,
      address: addressPart.replace(/^0x/i, ''),
      fee: relayerFeeByNetwork,
      decimals: selectedCurrency.decimals,
    };

    // Fee + destination should track the selected network (address validation already enforces match).
    sendTo(sendData, cid);
    navigate(ROUTES.MAIN.MAIN_PAGE);
  }

  const handleAddressChange = (nextAddress: string) => {
    const nextValues = { ...values, address: nextAddress };
    const nextHasAddressInput = nextValues.address.length > 0;
    const nextHasAmountInput = nextValues.send_amount.length > 0;
    setValues(nextValues);
    setErrors(validate(nextValues, { hasAddressInput: nextHasAddressInput, hasAmountInput: nextHasAmountInput }));
  }

  const handleAmountChange = (amount: string) => {
    const nextValues = { ...values, send_amount: amount };
    const nextHasAmountInput = nextValues.send_amount.length > 0;
    const nextHasAddressInput = nextValues.address.length > 0;
    setValues(nextValues);
    setErrors(validate(nextValues, { hasAddressInput: nextHasAddressInput, hasAmountInput: nextHasAmountInput }));
  };

  const BackDrop: React.FC<BackDropProps> = ({
    onCancel,
    children,
  }) => {
    const handleOutsideClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
      if (event.target === event.currentTarget) {
        onCancel?.(event);
      }
    };

    return (
      <BackdropStyled onClick={handleOutsideClick}>
        { children }
      </BackdropStyled>
    );
  };

  return (
    <Window>
      <SendStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
        <HeaderRow>
          <TitleBlock>
            <PageTitle>
              <TitleBridgeLabel>
                <TitleBridgePart>
                  <TitleTokenLabel>BEAM</TitleTokenLabel>
                  <BeamMark className={TitleIconClass} />
                </TitleBridgePart>
                <BridgeArrow className={TitleArrowClass} />
                <TitleBridgePart>
                  <TitleTokenLabel>WBEAM</TitleTokenLabel>
                  <NetworkIcon chainId={activeNetwork.network} className={TitleIconClass} />
                </TitleBridgePart>
              </TitleBridgeLabel>
            </PageTitle>
            <PageSubtitle>Paste the {networkName} bridge address to continue.</PageSubtitle>
          </TitleBlock>
          <BackButton type="button" onClick={() => navigate(ROUTES.MAIN.MAIN_PAGE)}>
            Back
          </BackButton>
        </HeaderRow>
        <SectionPanel>
          <Subtitle>{networkName} BRIDGE ADDRESS</Subtitle>
          <CurrInput placeholder="Paste bridge address here"
            onChangeHandler={handleAddressChange}
            valid={isAddressValid()}
            value={values.address}
            label={errors.address}
            variant="common"
            name="address"
          />
          {/* <EnsureField>Ensure the address matches the Ethereum network to avoid losses</EnsureField> */}
        </SectionPanel>

        { values.address && !errors.address ? (
          <AmountContainer>
            <AmountHeader>
              <Subtitle>AMOUNT</Subtitle>
              {availableCurrencies.length > 1 && (
                <TokenDropdown>
                  <TokenDropdownElem onClick={toggleCurrencyDropdown}>
                    <span className={TokenNameClass}>
                      {selectedCurrency?.name ?? availableCurrencies[0]?.name}
                    </span>
                    <TokenTriangle />
                  </TokenDropdownElem>
                  {isCurrencyOpen && (
                    <>
                      <TokenDropdownBody isVisible={isCurrencyOpen} className={`dropdown-body ${isCurrencyOpen && 'open'}`}>
                        {availableCurrencies.map((currency) => (
                          <TokenDropdownOption key={currency.rate_id} onClick={() => handleCurrencyClick(currency)}>
                            <span className={TokenNameClass}>
                              {currency.name}
                            </span>
                          </TokenDropdownOption>
                        ))}
                      </TokenDropdownBody>
                      <BackDrop onCancel={() => setCurrencyOpen(false)} />
                    </>
                  )}
                </TokenDropdown>
              )}
            </AmountHeader>
            <CurrInput 
              className={SendClass}
              onChangeHandler={handleAmountChange}
              value={values.send_amount}
              valid={isSendAmountValid()}
              label={errors.send_amount}
              variant='amount'
              name="amount"
              currencyLabel={selectedCurrency?.name ?? BEAM.name}
            />

            <FeeContainer>
              <FeeItem>
                <FormSubtitle className={FeeSubtitleClass}>RELAYER FEE</FormSubtitle>
                {relayerFeeByNetwork !== undefined && selectedCurrency && (
                  <>
                    <FeeValue>{relayerFeeByNetwork} {selectedCurrency.name}</FeeValue>
                    <Rate value={relayerFeeByNetwork}
                      selectedCurrencyId={selectedCurrency.rate_id}
                      className={RateStyleClass}
                    />
                  </>
                )}
              </FeeItem>

              <FeeItem>
                <FormSubtitle className={FeeSubtitleClass}>TRANSACTION FEE</FormSubtitle>
                <FeeValue>{0.011} BEAM</FeeValue>
                <Rate value={0.011}
                  selectedCurrencyId={BEAM.rate_id}
                  className={RateStyleClass}
                />
              </FeeItem>
            </FeeContainer>
          </AmountContainer>
          ) : (
          <InfoPanel>
            <ContainerLine>
              In order to transfer from Beam to {networkName} network, do the following:
            </ContainerLine>
            <InfoList>
              <ContainerLine>
                <Text>1.</Text>
                <Text>
                  {hasApiUrl ? (
                    <>
                      <a href={apiUrl} className={LinkClass} target="_blank" rel="noreferrer">
                        {networkName} side of the bridge
                      </a> in your web browser
                    </>
                  ) : (
                    <span className={MissingLinkClass}>
                      Bridge URL is not configured. Set API_URL to enable the link.
                    </span>
                  )}
                </Text>
              </ContainerLine>
              <ContainerLine>
                <Text>2.</Text>
                <Text>Connect your Metamask wallet</Text>
              </ContainerLine>
              <ContainerLine>
                <Text>3.</Text>
                <Text>
                  Choose <span className={pTitle}>Beam to {networkName} </span> 
                  and follow instructions to obtain {networkName} bridge address
                </Text>
              </ContainerLine>
              <ContainerLine>
                <Text>4.</Text>
                <Text>Get back to this screen and paste the address</Text>
              </ContainerLine>
            </InfoList>
          </InfoPanel>
        )}
        { values.address && !errors.address && (
          <ControlsStyled>
            <Button
              type="submit" 
              disabled={isFormDisabled()} 
              icon={IconSend}
              className={TransferButtonClass}
              pallete="purple" 
              variant="regular"
            >
                transfer
            </Button>
          </ControlsStyled>
        )}
      </SendStyled>
    </Window>
  );
};

export default Send;
