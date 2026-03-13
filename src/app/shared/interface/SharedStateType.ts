import { SystemState } from '@core/types';

export interface SharedStateType {
  routerLink: string;
  systemState: SystemState;
  isLoaded: boolean;
  activeNetwork: {
    network: string;
    pk: string;
  }
}
