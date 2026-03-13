import { call, delay, put, takeLatest, select } from 'redux-saga/effects';
import { navigate, setActiveNetwork } from '@app/shared/store/actions';
import { ROUTES, BEAM, ETH_ID, DEFAULT_NETWORK_ID, NETWORKS_BY_INDICATOR } from '@app/shared/constants';
import { loadPublicKey, loadIncoming } from '@core/beamAPI';
import { calcRelayFee, getGasPrice } from '@core/appUtils';
import { BridgeTransaction, IncomingTransaction } from '@app/core/types';
import { setIsLoaded } from '@app/shared/store/actions';
import { selectIsLoaded } from '@app/shared/store/selectors';

import * as actions from './actions';
import { GasPriceResponse, RatesApiResponse } from '../interfaces';

const FETCH_INTERVAL = 5000;
const API_URL = 'https://explorer-api.beam.mw/bridges';

export function* loadParamsSaga(
    action: ReturnType<typeof actions.loadAppParams.request>,
  ): Generator {
    try {
      yield call(loadPublicKey, action.payload ? action.payload : null, BEAM.cid_by_network[DEFAULT_NETWORK_ID]);

      let bridgeTransactions: BridgeTransaction[] = [];
      for (const networkId in BEAM.cid_by_network) {
        const trs = (yield call(loadIncoming, BEAM.cid_by_network[networkId])) as IncomingTransaction[];
       
        if (trs && trs.length > 0 && Number(networkId) !== NETWORKS_BY_INDICATOR.sep) {
          trs.forEach((item) => {
            bridgeTransactions.push({
              amount: item.amount,
              cid: BEAM.cid_by_network[networkId],
              id: item.MsgId,
              networkId,
            })
          });
        }
      }

      yield put(actions.setBridgeTransactions(bridgeTransactions));
    
      const isLoaded = yield select(selectIsLoaded());
      if (!isLoaded) {
        const pk = yield call(loadPublicKey, null, BEAM.cid_by_network[DEFAULT_NETWORK_ID]);

        yield put(setActiveNetwork({
          network: DEFAULT_NETWORK_ID,
          pk
        }));

        yield put(setIsLoaded(true));
        yield put(navigate(ROUTES.MAIN.MAIN_PAGE));
      }
    } catch (e) {
      yield put(actions.loadAppParams.failure(e));
    }
}

async function loadRatesCached(): Promise<RatesApiResponse | null> {
  try {
    const response = await fetch(`${API_URL}/rates`);
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
}

async function loadGasPricesApiCall(): Promise<GasPriceResponse | null> {
  try {
    const response = await fetch(`${API_URL}/gasprices`);
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
}

export function* loadRatesSaga() {
  try {
    const ratesApiResponse = yield call(loadRatesCached);
    yield put(actions.loadRate.success(ratesApiResponse));
    yield delay(FETCH_INTERVAL);
    yield put(actions.loadRate.request());
  } catch (e) {
    yield put(actions.loadRate.failure(e));
  }
}

export function* loadRelayerFeesSaga(action: ReturnType<typeof actions.loadRelayerFees.request>): Generator {
  try {
    const gasPricesResponse = (yield call(loadGasPricesApiCall)) as GasPriceResponse | null;
    if (!gasPricesResponse) {
      throw new Error('Failed to load gas prices');
    }
    const fees = Object.entries(gasPricesResponse).map(([network, gasPriceValue]) => {
      const gasPrice = getGasPrice(gasPriceValue, network);

      const currencyRateUSD = action.payload?.rates?.[action.payload?.currency?.rate_id]?.usd;
      const baseRateUSD = action.payload?.rates?.[ETH_ID]?.usd;

      // Prevent runtime crashes if rates are missing/partial.
      if (!currencyRateUSD || !baseRateUSD) {
        return [network, 0];
      }

      const feeParams = {
        gasPrice,
        currencyPriceInUSD: currencyRateUSD,
        baseCurrencyPriceInUSD: baseRateUSD,
        currencyDecimals: action.payload.currency.decimals,
      };

      const relayFee = calcRelayFee(feeParams);
      
      return [network, relayFee];
    });
    const relayerFees = Object.fromEntries(fees);
    yield put(actions.loadRelayerFees.success(relayerFees));
  } catch (e) {
    yield put(actions.loadRelayerFees.failure(e));
  }
}

function* mainSaga() {
    yield takeLatest('@@MAIN/LOAD_PARAMS', loadParamsSaga);
    yield takeLatest('@@MAIN/GET_RATE', loadRatesSaga);
    yield takeLatest('@@MAIN/GET_RELAYER_FEES', loadRelayerFeesSaga);
}

export default mainSaga;
