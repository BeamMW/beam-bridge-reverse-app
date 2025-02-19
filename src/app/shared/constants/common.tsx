import { Currency } from "@app/containers/Main/interfaces";

export const GROTHS_IN_BEAM = 100000000;
export const BEAMX_TVL = 100000000;
export const BEAMX_TVL_STR = '100 000 000';
export const ETH_ID = "ethereum";
export const DEFAULT_NETWORK_ID = "421614";

export const BEAM: Currency = {
  name: 'BEAM',
  rate_id: 'beam',
  id: 1,
  decimals: 8,
  fee_decimals: 8,
  validator_dec: 8,
  cid_by_network: {
    ["1"]: "e63bd26ca5b226558686dd191122a8e5d6861a97597db9f40bda48aef6dbe835",
    ["11155111"]: "e63bd26ca5b226558686dd191122a8e5d6861a97597db9f40bda48aef6dbe835",
    ["42161"]: "e63bd26ca5b226558686dd191122a8e5d6861a97597db9f40bda48aef6dbe835",
    ["421614"]: "6e11fbb9b70832da1007a50d74b465027c323ca294699d8e030b5f77d0af3045",
  },
};

export const NETWORKS_BY_INDICATOR: {
  [indicator: string]: number,
} = {
  "eth": 1,
  "sep": 11155111,
  "arbsep": 421614,
  "arb": 42161, 
};

export const NETWORKS_BY_ID: {
  [id: string]: {
    name: string,
    indicator: string,
    relayerFeeNetworkId: string,
  },
} = {
  "1": {
    name: "Ethereum",
    indicator: "eth",
    relayerFeeNetworkId: "ethereum"
  },
  "11155111": {
    name: "Sepolia",
    indicator: "sep",
    relayerFeeNetworkId: "ethereum-sepolia"
  },
  "421614": {
    name: "Arbitrum Sepolia",
    indicator: "arbsep",
    relayerFeeNetworkId: "arbitrum-sepolia"
  },
  "42161": {
    name: "Arbitrum",
    indicator: "arb",
    relayerFeeNetworkId: "arbitrum",
  }, 
};
