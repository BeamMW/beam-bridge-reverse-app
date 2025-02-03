export const GROTHS_IN_BEAM = 100000000;
export const BEAMX_TVL = 100000000;
export const BEAMX_TVL_STR = '100 000 000';

export const BEAM: {
  name: string,
  rate_id: string,
  id: number,
  decimals: number,
  fee_decimals: number,
  validator_dec: number,
  cid_by_network: {
    [network_id: string]: string,
  },
} = {
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
