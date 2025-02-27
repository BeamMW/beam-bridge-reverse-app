import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@linaria/react';
import { Button, CurrInput, Rate, Window } from '@app/shared/components';
import { css } from '@linaria/core';

import { IconCancel, IconSend } from '@app/shared/icons';
import { useNavigate } from 'react-router-dom';
import { BEAM, NETWORKS_BY_ID, NETWORKS_BY_INDICATOR, ROUTES } from '@app/shared/constants';
import { sendTo } from '@core/beamAPI';
import { useFormik } from 'formik';
import ethereum_address from 'ethereum-address';
import { useDispatch, useSelector } from 'react-redux';
import { selectRates, selectRelayerFees } from '../../store/selectors';
import { loadRelayerFees } from '../../store/actions';
import { selectActiveNetwork } from '@app/shared/store/selectors';

interface SendFormData {
  send_amount: string;
  address: string;
}
let isLoaded = false;

const SendStyled = styled.form`
  width: 580px;
  margin: 0 auto !important;
`;

const ControlsStyled = styled.div`
  margin: 30px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 4px;
  text-align: center;
  text-transform: uppercase;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 20px;
  margin-top: 30px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 50px 20px;
  margin-top: 20px;
`;

const ContainerLine = styled.p`
  color: rgba(255, 255, 255, .7);
  font-size: 16px;
  font-style: italic;
  display: flex;
  flex-direction: row;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 3.11px;
  text-transform: uppercase;
`;

const RateStyleClass = css`
  font-size: 12px;
  align-self: start;
`;

const EnsureField = styled.p`
  opacity: 0.5;
  font-size: 14px;
  font-style: italic;
  letter-spacing: 0.26px;
  margin-left: 15px;
  margin-top: 10px;
`;

const InfoList = styled.div`
  margin-left: 15px;
  line-height: 1.88;
  margin-top: 20px;
`;

const Text = styled.span`
  max-width: 480px;
  word-break: break-word;
`;

const LinkClass = css`
  color: #00f6d2;
  text-decoration: none;
  font-weight: bold
  margin-left: 4px;
`;

const CancelButtonClass = css`
  max-width: 133px !important;
  margin: 0 !important;
`;

const TransferButtonClass = css`
  max-width: 141px !important;
  margin: 0 0 0 20px !important;
`;

const pTitle = css`
  color: rgba(255, 255, 255, 1) !important;
  font-weight: bold;
`;

const SendClass = css`
  height: 55px !important;
`;

const AmountContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  margin-top: 20px;
`;

const FeeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const FeeItem = styled.div`
`;

const FeeValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #da68f5;
  margin-top: 10px;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin-top: 30px;
  letter-spacing: 3.11px;
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
  const [address, setAddress] = useState<string>(null);
  const [networkId, setNetworkId] = useState<number>(null);
  const [relayerFeeByNetwork, setRelayerFeeByNetwork] = useState<number>();
  const [selectedCurrency, setCurrency] = useState(null);
  const activeNetwork = useSelector(selectActiveNetwork());

  const formik = useFormik<SendFormData>({
    initialValues: {
      send_amount: '',
      address: ''
    },
    isInitialValid: false,
    onSubmit: (value) => {
    
    },
    validate: (e) => validate(e),
  });

  const {
    values, setFieldValue, errors, submitForm, resetForm
  } = formik;

  useEffect(() => {
    if (rates) {
      dispatch(loadRelayerFees.request({
        rates,
        currency: BEAM,
      }));
    }
  }, [rates]);

  useEffect(() => {
    if (relayerFees && networkId) {
      const relayerFeeNetworkId = NETWORKS_BY_ID[networkId].relayerFeeNetworkId;
      setRelayerFeeByNetwork(Number(relayerFees[relayerFeeNetworkId]));
    }
  }, [relayerFees, networkId]);

  const validate = async (formValues: SendFormData) => {
    const errorsValidation: any = {};
    const {
        send_amount,
        address
    } = formValues;

    if (!isLoaded && send_amount.length > 0) {
      isLoaded = true;
    }
    if ((send_amount == '' || parseFloat(send_amount) == 0) && isLoaded) {
      errorsValidation.send_amount = `Insufficient amount`;
    }

    const separatedAddress = address.slice(0, 42);
    const networkIndicator = address.substring(42);

    const regex = new RegExp('^[A-Za-z0-9]+$');
    if (!regex.test(separatedAddress) || !ethereum_address.isAddress(separatedAddress) || !NETWORKS_BY_INDICATOR[networkIndicator]) {
      errorsValidation.address = `Unrecognized address`;
      return errorsValidation;
    }

    if (NETWORKS_BY_INDICATOR[networkIndicator] !== Number(activeNetwork.network)) {
      errorsValidation.address = `Incorrect network`;
    }
    return errorsValidation;
  };

  const isFormDisabled = () => {
    if (!formik.isValid) return !formik.isValid;
    if (!isLoaded || !relayerFeeByNetwork) return true;
    return false;
  };

  const currChanged = (newCurr) => {
    setCurrency(newCurr);
  }

  const isAddressValid = () => !errors.address;
  const isSendAmountValid = () => !errors.send_amount;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const amount = parseFloat(data.get('amount') as string);
    
    const sendData = {
      amount, 
      address: address.replace('0x',''), 
      fee: relayerFeeByNetwork,
      decimals: BEAM.decimals,
      BEAM
    };

    sendTo(sendData, BEAM.cid_by_network[networkId]);
    navigate(ROUTES.MAIN.MAIN_PAGE);
  }

  const cancelClicked = () => {
    isLoaded = false;
    navigate(ROUTES.MAIN.MAIN_PAGE);
  }

  const handleAddressChange = (address: string) => {
    const separatedAddress = address.slice(0, 42);
    const networkIndicator = address.substring(42);
    
    setFieldValue('address', address, true);
    setAddress(separatedAddress);
    setNetworkId(NETWORKS_BY_INDICATOR[networkIndicator] ? NETWORKS_BY_INDICATOR[networkIndicator] : null)
  }

  const handleAmountChange = (amount: string) => {
    setFieldValue('send_amount', amount, true);
  };

  return (
    <Window>
      <SendStyled autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Title>
          BEAM TO {NETWORKS_BY_ID[activeNetwork.network]?.name}
        </Title>
        <Container>
          <Subtitle>{NETWORKS_BY_ID[activeNetwork.network]?.name} BRIDGE ADDRESS</Subtitle>
          <CurrInput placeholder="Paste bridge address here"
            onChangeHandler={handleAddressChange}
            valid={isAddressValid()}
            value={values.address}
            label={errors.address}
            variant="common"
            name="address"
          />
          {/* <EnsureField>Ensure the address matches the Ethereum network to avoid losses</EnsureField> */}
        </Container>

        { address && !errors.address ? (
          <AmountContainer>
            <Subtitle>AMOUNT</Subtitle>
            <CurrInput 
              onCurrChangeCb={ currChanged }
              className={SendClass}
              onChangeHandler={handleAmountChange}
              value={values.send_amount}
              valid={isSendAmountValid()}
              label={errors.send_amount}
              variant='amount'
              name="amount"
            />

            <FeeContainer>
              <FeeItem>
                <FormSubtitle className={FeeSubtitleClass}>RELAYER FEE</FormSubtitle>
                {relayerFees && (
                  <>
                    <FeeValue>{relayerFeeByNetwork} {BEAM.name}</FeeValue>
                    <Rate value={relayerFeeByNetwork}
                      selectedCurrencyId={BEAM.rate_id}
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
          <InfoContainer>
            <ContainerLine>
              In order to transfer from Beam to {NETWORKS_BY_ID[activeNetwork.network]?.name} network, do the following:
            </ContainerLine>
            <InfoList>
              <ContainerLine>
                <Text>1.</Text>
                <Text>
                  <a href={process.env.API_URL} className={LinkClass} target="_blank">
                    {NETWORKS_BY_ID[activeNetwork.network]?.name} side of the bridge
                  </a> in your web browser
                </Text>
              </ContainerLine>
              <ContainerLine>
                <Text>2.</Text>
                <Text>Connect your Metamask wallet</Text>
              </ContainerLine>
              <ContainerLine>
                <Text>3.</Text>
                <Text>
                  Choose <span className={pTitle}>Beam to {NETWORKS_BY_ID[activeNetwork.network]?.name} </span> 
                  and follow instructions to obtain {NETWORKS_BY_ID[activeNetwork.network]?.name} bridge address
                </Text>
              </ContainerLine>
              <ContainerLine>
                <Text>4.</Text>
                <Text>Get back to this screen and paste the address</Text>
              </ContainerLine>
            </InfoList>
          </InfoContainer>
        )}
        <ControlsStyled>
          <Button
            variant="ghost" 
            onClick={cancelClicked} 
            pallete="purple" 
            className={CancelButtonClass}
            icon={IconCancel}
          >
            close
          </Button>
          { address && (
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
          )}
        </ControlsStyled>
      </SendStyled>
    </Window>
  );
};

export default Send;
