import { BridgeTransaction } from '@core/types';
import BigNumber from 'bignumber.js';

export interface BridgeStateType {
  bridgeTransactions: BridgeTransaction[];
  rates: RatesApiResponse;
  relayerFees: RelayerFees;
};

export interface RatesApiResponse {
  [currency: string]: {
    usd: number;
  }
}

interface GasPrice {
  type: BigNumber;
  hex: string;
};

export interface GasPriceItem {
  lastBaseFeePerGas: GasPrice;
  maxFeePerGas: GasPrice;
  maxPriorityFeePerGas: GasPrice;
  gasPrice: GasPrice;
};

export interface RelayFeeParams {
  baseCurrencyPriceInUSD: number;
  currencyPriceInUSD: number;
  gasPrice: number;
  currencyDecimals: number;
}

export interface GasPriceResponse {
  [network: string]: GasPriceItem;
};

export interface Currency {
  id?: number;
  name: string;
  rate_id: string;
  decimals: number;
  fee_decimals?: number;
  validator_dec: number;
  cid_by_network: {
    [network_id: string]: string;
  }
};

export interface RelayerFees {
  [network: string]: number;
}
