import { BridgeStateType } from '../interfaces';
import * as actions from './actions';

type Action =
  | ReturnType<typeof actions.setBridgeTransactions>
  | ReturnType<typeof actions.loadRate.success>
  | ReturnType<typeof actions.loadRelayerFees.success>;

const initialState: BridgeStateType = {
  bridgeTransactions: [],
  relayerFees: {},
  rates: {},
};

const reducer = (state: BridgeStateType = initialState, action: Action): BridgeStateType => {
  switch (action.type) {
    case '@@MAIN/SET_BRIDGE_TRANSACTIONS':
      return {
        ...state,
        bridgeTransactions: action.payload,
      };
    case '@@MAIN/GET_RATE_SUCCESS':
      return {
        ...state,
        rates: action.payload ?? {},
      };
    case '@@MAIN/GET_RELAYER_FEES_SUCCESS':
      return {
        ...state,
        relayerFees: action.payload,
      };
    default:
      return state;
  }
};

export { reducer as MainReducer };
