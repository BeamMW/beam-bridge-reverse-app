import { createAsyncAction, createAction } from 'typesafe-actions';
import { BridgeTransaction, BridgeAppParams } from '@core/types';
import { Currency, RatesApiResponse, RelayerFees } from '../interfaces';

export const setBridgeTransactions = createAction('@@MAIN/SET_BRIDGE_TRANSACTIONS')<BridgeTransaction[]>();
export const setPk = createAction('@@MAIN/SET_PK')<string>();


export const setAppParams = createAction('@@MAIN/SET_PARAMS')<BridgeAppParams>();
export const setIsInProgress = createAction('@@MAIN/SET_IS_IN_PROGRESS')<boolean>();
export const setFeeValues = createAction('@@MAIN/SET_FEE_VALUES')<any>();

export const setPopupState = createAction('@@MAIN/SET_POPUP_STATE')<{type: string, state: boolean}>();

export const loadAppParams = createAsyncAction(
    '@@MAIN/LOAD_PARAMS',
    '@@MAIN/LOAD_PARAMS_SUCCESS',
    '@@MAIN/LOAD_PARAMS_FAILURE',
)<ArrayBuffer, BridgeAppParams, any>();

export const loadRate = createAsyncAction(
    '@@MAIN/GET_RATE',
    '@@MAIN/GET_RATE_SUCCESS',
    '@@MAIN/GET_RATE_FAILURE',
  )<void, RatesApiResponse, any>();

  export const loadRelayerFees = createAsyncAction(
    '@@MAIN/GET_RELAYER_FEES',
    '@@MAIN/GET_RELAYER_FEES_SUCCESS',
    '@@MAIN/GET_RELAYER_FEES_FAILURE',
  )<{
    currency: Currency,
    rates: RatesApiResponse,
  }, RelayerFees, any>();
