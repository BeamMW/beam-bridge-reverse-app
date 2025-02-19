import { SharedStateType } from '@app/shared/interface/SharedStateType';
import { BridgeStateType } from '@app/containers/Main/interfaces';

export interface AppState {
  shared: SharedStateType;
  main: BridgeStateType;
};
