export type Pallete = 'green' | 'ghost' | 'purple' | 'blue' | 'red' | 'white' | 'vote-red';

export type ButtonVariant = 'regular' | 'ghost' | 'ghostBordered' | 'block' | 'link' | 'icon';

export interface BridgeTransaction {
  id: string;
  amount: string;
  cid: string;
  networkId: string;
}

export interface IncomingTransaction {
  amount: string;
  MsgId: string;
}

export interface SystemState {
  current_height: number
  current_state_hash: string
  current_state_timestamp: number
  is_in_sync: boolean
  prev_state_hash: string;
  tip_height: number;
  tip_prev_state_hash: string;
  tip_state_hash: string;
  tip_state_timestamp: number;
}