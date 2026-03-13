import { SystemState } from '@core/types';

export const navigate = (payload: string) => ({
  type: '@@SHARED/NAVIGATE' as const,
  payload,
});
export const setActiveNetwork = (payload: { network: string; pk: string }) => ({
  type: '@@SHARED/SET_ACTIVE_NETWORK' as const,
  payload,
});

export const setSystemState = (payload: SystemState) => ({
  type: '@@SHARED/SET_SYSTEM_STATE' as const,
  payload,
});
export const setIsLoaded = (payload: boolean) => ({
  type: '@@SHARED/SET_IS_LOADED' as const,
  payload,
});