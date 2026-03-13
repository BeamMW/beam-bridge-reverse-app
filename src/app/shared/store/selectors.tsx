import { AppState } from '../interface';

const selectShared = (state: AppState) => state.shared;

export const selectRouterLink = () => (state: AppState) => selectShared(state).routerLink;
export const selectSystemState = () => (state: AppState) => selectShared(state).systemState;
export const selectIsLoaded = () => (state: AppState) => selectShared(state).isLoaded;
export const selectActiveNetwork = () => (state: AppState) => selectShared(state).activeNetwork;