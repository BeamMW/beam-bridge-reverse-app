import { AppState } from '../../../shared/interface';

const selectMain = (state: AppState) => state.main;

export const selectBridgeTransactions = () => (state: AppState) => selectMain(state).bridgeTransactions;



export const selectRates = () => (state: AppState) => selectMain(state).rates;
export const selectRelayerFees = () => (state: AppState) => selectMain(state).relayerFees;
