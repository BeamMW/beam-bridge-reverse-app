import { BridgeTransaction } from '@core/types';
import { Currency, RatesApiResponse, RelayerFees } from '../interfaces';

export const setBridgeTransactions = (payload: BridgeTransaction[]) => ({
  type: '@@MAIN/SET_BRIDGE_TRANSACTIONS' as const,
  payload,
});

export const loadAppParams = {
  request: (payload: ArrayBuffer | null) => ({
    type: '@@MAIN/LOAD_PARAMS' as const,
    payload,
  }),
  failure: (payload: any) => ({
    type: '@@MAIN/LOAD_PARAMS_FAILURE' as const,
    payload,
  }),
};

export const loadRate = {
  request: () => ({
    type: '@@MAIN/GET_RATE' as const,
  }),
  success: (payload: RatesApiResponse | null) => ({
    type: '@@MAIN/GET_RATE_SUCCESS' as const,
    payload,
  }),
  failure: (payload: any) => ({
    type: '@@MAIN/GET_RATE_FAILURE' as const,
    payload,
  }),
};

export const loadRelayerFees = {
  request: (payload: { currency: Currency; rates: RatesApiResponse }) => ({
    type: '@@MAIN/GET_RELAYER_FEES' as const,
    payload,
  }),
  success: (payload: RelayerFees) => ({
    type: '@@MAIN/GET_RELAYER_FEES_SUCCESS' as const,
    payload,
  }),
  failure: (payload: any) => ({
    type: '@@MAIN/GET_RELAYER_FEES_FAILURE' as const,
    payload,
  }),
};
