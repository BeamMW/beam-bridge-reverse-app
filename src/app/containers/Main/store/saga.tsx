import { call, put, takeLatest, select } from 'redux-saga/effects';
import { navigate } from '@app/shared/store/actions';
import { ROUTES, BEAM, ETH_ID, DEFAULT_NETWORK_ID } from '@app/shared/constants';
import { loadPublicKey, loadIncoming } from '@core/beamAPI';
import { calcRelayFee, getGasPrice } from '@core/appUtils';
import { BridgeTransaction, IncomingTransaction } from '@app/core/types';
import { setIsLoaded } from '@app/shared/store/actions';
import { selectIsLoaded } from '@app/shared/store/selectors';

import { actions } from '.';
import store from '../../../../index';
import { GasPriceItem, GasPriceResponse, RatesApiResponse } from '../interfaces';

const FETCH_INTERVAL = 5000;
const API_URL = 'https://explorer-api.beam.mw/bridges';

export function* loadParamsSaga(
    action: ReturnType<typeof actions.loadAppParams.request>,
  ): Generator {
    try {
      yield call(loadPublicKey, action.payload ? action.payload : null, BEAM.cid_by_network[DEFAULT_NETWORK_ID]);

      let bridgeTransactions: BridgeTransaction[] = [];
      const trs = (yield call(loadIncoming, BEAM.cid_by_network[DEFAULT_NETWORK_ID])) as IncomingTransaction[];
      trs.forEach((item, i) => {
        bridgeTransactions.push({
          amount: item.amount,
          cid: BEAM.cid_by_network[DEFAULT_NETWORK_ID],
          pid: i,
          id: item.MsgId,
          status: ''
        })
      });

      yield put(actions.setBridgeTransactions(bridgeTransactions));
    
      const isLoaded = yield select(selectIsLoaded());
      if (!isLoaded) {
        store.dispatch(setIsLoaded(true));
        yield put(navigate(ROUTES.MAIN.MAIN_PAGE));
      }
    } catch (e) {
      yield put(actions.loadAppParams.failure(e));
    }
}

async function loadRatesCached(): Promise<RatesApiResponse> {
  try {
    const response = await fetch(`${API_URL}/rates`);
    if (response.status === 200) {
      const promise = await response.json();
      return promise;
    }

    return null;
  } catch (error) {
    console.log(error)
  }
}

async function loadGasPricesApiCall(): Promise<GasPriceResponse> {
  try {
    const response = await fetch(`${API_URL}/gasprices`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export function* loadRatesSaga() {
  try {
    const ratesApiResponse = yield call(loadRatesCached);
    yield put(actions.loadRate.success(ratesApiResponse));
    setTimeout(() => store.dispatch(actions.loadRate.request()), FETCH_INTERVAL);
  } catch (e) {
    yield put(actions.loadRate.failure(e));
  }
}

export function* loadRelayerFeesSaga(action: ReturnType<typeof actions.loadRelayerFees.request>): Generator {
  try {
    const gasPricesResponse = (yield call(loadGasPricesApiCall)) as GasPriceItem;
    const fees = Object.entries(gasPricesResponse).map(([network, gasPriceValue]) => {
      const gasPrice = getGasPrice(gasPriceValue);

      const relayFee = calcRelayFee({
        gasPrice,
        currencyPriceInUSD: action.payload.rates[action.payload.currency.rate_id].usd,
        baseCurrencyPriceInUSD: action.payload.rates[ETH_ID].usd,
        currencyDecimals: action.payload.currency.decimals,
      });

      return [network, relayFee];
    });
    const relayerFees = Object.fromEntries(fees);
    yield put(actions.loadRelayerFees.success(relayerFees));
  } catch (e) {
    yield put(actions.loadRelayerFees.failure(e));
  }
}

function* mainSaga() {
    yield takeLatest(actions.loadAppParams.request, loadParamsSaga);
    yield takeLatest(actions.loadRate.request, loadRatesSaga);
    yield takeLatest(actions.loadRelayerFees.request, loadRelayerFeesSaga);
}

export default mainSaga;
