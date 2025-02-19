import { createSelector } from 'reselect';
import { AppState } from '../../../shared/interface';

const selectMain = (state: AppState) => state.main;

export const selectBridgeTransactions = () => createSelector(selectMain, (state) => state.bridgeTransactions);



export const selectAppParams = () => createSelector(selectMain, (state) => state.appParams);
export const selectRates = () => createSelector(selectMain, (state) => state.rates);
export const selectPopupsState = () => createSelector(selectMain, 
    (state) => state.popupsState);
export const selectRelayerFees = () => createSelector(selectMain, (state) => state.relayerFees);
