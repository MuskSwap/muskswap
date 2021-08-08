import BigNumber from 'bignumber.js';

export enum eEthereumNetwork {
  hardhat = 'hardhat',
  bsctest = 'bsctest',
  bsc = 'bsc',
}

export enum eContractid {
  SellToken = 'SellToken',
  CakeToken = 'CakeToken',
  MasterChef = 'MasterChef',
  SyrupBar = 'SyrupBar',
  MuskToken = 'MuskToken',
  MuskStakeToken = 'MuskStakeToken',
  MuskProofOfStake = 'MuskProofOfStake',
  MuskDefi = 'MuskDefi',
  MuskDefiImpl = 'MuskDefiImpl',
  MuskDefiProxy = 'MuskDefiProxy',
  TransparentUpgradeableProxy = 'TransparentUpgradeableProxy',
  Multicall = 'Multicall2',
}

export type tEthereumAddress = string;
export type tStringTokenBigUnits = string; // 1 ETH, or 10e6 USDC or 10e18 DAI
export type tBigNumberTokenBigUnits = BigNumber;
// 1 wei, or 1 basic unit of USDC, or 1 basic unit of DAI
export type tStringTokenSmallUnits = string;
export type tBigNumberTokenSmallUnits = BigNumber;

export interface iParamsPerNetwork<T> {
  [eEthereumNetwork.hardhat]: T;
  [eEthereumNetwork.bsctest]: T;
  [eEthereumNetwork.bsc]: T;
}
