import { Currency } from "@app/containers/Main/interfaces";

export const ETH_ID = "ethereum";
export const DEFAULT_NETWORK_ID = "42161";

export const BEAM: Currency = {
  name: 'BEAM',
  rate_id: 'beam',
  decimals: 8,
  validator_dec: 8,
  cid_by_network: {
    ["1"]: "e63bd26ca5b226558686dd191122a8e5d6861a97597db9f40bda48aef6dbe835",
    // ["11155111"]: "6e11fbb9b70832da1007a50d74b465027c323ca294699d8e030b5f77d0af3045",
    ["42161"]: "d2505213880d87a4747d23036a02d8919be211d26266cd6f3e591536e44f27fe",
    // ["421614"]: "6e11fbb9b70832da1007a50d74b465027c323ca294699d8e030b5f77d0af3045",
  },
};

export const CURRENCIES: Currency[] = [
  BEAM,
  {
    id: 1,
    name: 'bUSDT',
    rate_id: 'tether',
    decimals: 8,
    fee_decimals: 6,
    validator_dec: 6,
    cid_by_network: {
      ["1"]: "99c1e7d6168d71a0181ad2c8d75a1e37d671a75b4f2bd82907645f52baf7cecf",
    },
  },
  {
    id: 2,
    name: 'bETH',
    rate_id: 'ethereum',
    decimals: 8,
    fee_decimals: 8,
    validator_dec: 8,
    cid_by_network: {
      ["1"]: "2ce5d66babf25f1a1908df54b8d7ca6a14f7f9432e78ef94ac97293170924dec",
    },
  },
  {
    id: 3,
    name: 'bDAI',
    rate_id: 'dai',
    decimals: 8,
    fee_decimals: 8,
    validator_dec: 8,
    cid_by_network: {
      ["1"]: "3e90f6dce9518738fdd818e02477cc41d43093ee1ce5c16ecfd61ca24153c423",
    },
  },
  {
    id: 4,
    name: 'bWBTC',
    rate_id: 'wrapped-bitcoin',
    decimals: 8,
    fee_decimals: 8,
    validator_dec: 6,
    cid_by_network: {
      ["1"]: "a21d770ab51a61fe6913e567022e71745e7dbfd2fdc87e43123784065d218a98",
    },
  },
];

export const NETWORKS_BY_INDICATOR: {
  [indicator: string]: number,
} = {
  "eth": 1,
  // "sep": 11155111,
  // "arbsep": 421614,
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
  // "11155111": {
  //   name: "Sepolia",
  //   indicator: "sep",
  //   relayerFeeNetworkId: "ethereum-sepolia"
  // },
  // "421614": {
  //   name: "Arbitrum Sepolia",
  //   indicator: "arbsep",
  //   relayerFeeNetworkId: "arbitrum-sepolia"
  // },
  "42161": {
    name: "Arbitrum",
    indicator: "arb",
    relayerFeeNetworkId: "arbitrum",
  }, 
};
