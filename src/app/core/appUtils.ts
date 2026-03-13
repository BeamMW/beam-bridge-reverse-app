import { GasPriceItem, RelayFeeParams } from '@app/containers/Main/interfaces';
import { BigNumber as EthersBigNumber, utils as ethersUtils } from 'ethers';

const GWEI_IN_ETH = Math.pow(10, 9);
const RELAY_COSTS_IN_GAS = 120000;
const RELAY_SAFETY_COEFF = 2;

export const copyToClipboard = (value: string) => {
  const textField = document.createElement('textarea');
  textField.innerText = value;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
};

export function toUSD(amount: number, rate: number): string {
  switch (true) {
    case amount === 0 || Number.isNaN(amount):
      return '0 USD';
    case amount > 0.011: {
      const value = amount * rate;
      return `${value.toFixed(2)} USD`;
    }
    default:
      return '< 1 cent';
  }
}

export function getSign(positive: boolean): string {
  return positive ? '+ ' : '- ';
}
export function calcRelayFee(params: RelayFeeParams): number {
  const relayCostsInUSD = (RELAY_COSTS_IN_GAS * params.gasPrice * params.baseCurrencyPriceInUSD) / GWEI_IN_ETH;
  const result = RELAY_SAFETY_COEFF * relayCostsInUSD / params.currencyPriceInUSD;

  return result;
}

export function getGasPrice(feeData: GasPriceItem, debugNetwork?: string): number {
  // Parse hex-encoded wei values safely (no JS number precision issues).
  const baseWei = EthersBigNumber.from(feeData.gasPrice?.hex ?? 0);
  const rawPriorityWei = EthersBigNumber.from(feeData.maxPriorityFeePerGas?.hex ?? 0);
  // Arbitrum: ignore priority fee.
  const priorityWei = debugNetwork === 'arbitrum' ? EthersBigNumber.from(0) : rawPriorityWei;

  // Apply safety factor (1.2x) using integer math; ceil to avoid underestimating.
  const baseWithSafetyWei = baseWei.mul(12).add(9).div(10);
  const totalWei = baseWithSafetyWei.add(priorityWei);

  // Convert wei -> gwei as a float for downstream USD fee calc.
  const totalGwei = parseFloat(ethersUtils.formatUnits(totalWei, 9));

  return totalGwei;
}