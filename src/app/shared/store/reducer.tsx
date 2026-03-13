import { SharedStateType } from '../interface';
import * as actions from './actions';

type Action =
  | ReturnType<typeof actions.navigate>
  | ReturnType<typeof actions.setActiveNetwork>
  | ReturnType<typeof actions.setSystemState>
  | ReturnType<typeof actions.setIsLoaded>;

const initialState: SharedStateType = {
  routerLink: '',
  systemState: {
    current_height: 0,
    current_state_hash: '',
    current_state_timestamp: 0,
    is_in_sync: false,
    prev_state_hash: '',
    tip_height: 0,
    tip_prev_state_hash: '',
    tip_state_hash: '',
    tip_state_timestamp: 0
  },
  isLoaded: false,
  activeNetwork: {
    network: "",
    pk: "",
  },
};

const reducer = (state: SharedStateType = initialState, action: Action): SharedStateType => {
  switch (action.type) {
    case '@@SHARED/NAVIGATE': {
      return {
        ...state,
        routerLink: action.payload,
      };
    }
    case '@@SHARED/SET_IS_LOADED': {
      return {
        ...state,
        isLoaded: action.payload,
      };
    }
    case '@@SHARED/SET_ACTIVE_NETWORK': {
      return {
        ...state,
        activeNetwork: action.payload,
      };
    }
    case '@@SHARED/SET_SYSTEM_STATE': {
      return {
        ...state,
        systemState: action.payload,
      };
    }
    default:
      return state;
  }
};

export { reducer as SharedReducer };
