import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { BridgeStateType } from '../interfaces';
import * as actions from './actions';

type Action = ActionType<typeof actions>;

const initialState: BridgeStateType = {
  bridgeTransactions: [],
  pk: '',

  appParams: {
    backlogPeriod: 0,
    enabled: 0,
    isAdmin: 0,
    withdrawLimit: 0
  },
  popupsState: {
    withdraw: false,
    deposit: false
  },
  relayerFees: {},
  rates: {},
};

const reducer = createReducer<BridgeStateType, Action>(initialState)
  .handleAction(actions.setBridgeTransactions, (state, action) => produce(state, (nexState) => {
    nexState.bridgeTransactions = action.payload;
  }))
  .handleAction(actions.loadAppParams.success, (state, action) => produce(state, (nexState) => {
    nexState.appParams = action.payload;
  }))
  .handleAction(actions.setPopupState, (state, action) => produce(state, (nexState) => {
    nexState.popupsState[action.payload.type] = action.payload.state;
  }))
  .handleAction(actions.loadRate.success, (state, action) => produce(state, (nexState) => {
    nexState.rates = action.payload;
  }))
  .handleAction(actions.loadRelayerFees.success, (state, action) => produce(state, (nexState) => {
    nexState.relayerFees = action.payload;
  }));

export { reducer as MainReducer };
