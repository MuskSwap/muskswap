import { deployContract, getContractFactory, getContract } from './contracts-helpers';
import { eContractid, tEthereumAddress } from './types';
import { verifyContract } from './etherscan-verification';
import { getDb, DRE } from './misc-utils';
import { zeroAddress } from 'ethereumjs-util';
import { ZERO_ADDRESS } from './constants';
import { Signer } from 'ethers';
import { ContractType } from 'hardhat/internal/hardhat-network/stack-traces/model';
import { MuskProofOfStake } from '../types/MuskProofOfStake';
import { MuskToken } from '../types/MuskToken';
import { TransparentUpgradeableProxy } from '../types/TransparentUpgradeableProxy';
import { MuskDefi } from '../types/MuskDefi';
import { SellToken } from '../types';

export const deployTransparentUpgradeableProxy = async (verify?: boolean, args?: any) => {
  const id = eContractid.TransparentUpgradeableProxy;
  // const args: string[] = [];
  const instance = await deployContract<TransparentUpgradeableProxy>(id, args);
  await instance.deployTransaction.wait();
  if (verify) {
    await verifyContract(id, instance.address, args);
  }
  return instance;
};

export const getCakeTokenContract = async (address?: string) => {
  return getContract(
    eContractid.CakeToken,
    address || (await getDb().get(`${eContractid.CakeToken}.${DRE.network.name}`).value()).address
  );
};

export const getSyrupBarContract = async (address?: string) => {
  return getContract(
    eContractid.SyrupBar,
    address || (await getDb().get(`${eContractid.SyrupBar}.${DRE.network.name}`).value()).address
  );
};

export const getMuskTokenContract = async (address?: string) => {
  console.log(DRE.network.name);
  return getContract<MuskToken>(
    eContractid.MuskToken,
    address || (await getDb().get(`${eContractid.MuskToken}.${DRE.network.name}`).value()).address
  );
};

export const getMuskPosContract = async (address?: string) => {
  return getContract<MuskProofOfStake>(
    eContractid.MuskProofOfStake,
    address ||
      (await getDb().get(`${eContractid.MuskProofOfStake}.${DRE.network.name}`).value()).address
  );
};

export const getMuskDefiImplContract = async (address?: string) => {
  return getContract<MuskDefi>(
    eContractid.MuskDefi,
    address || (await getDb().get(`${eContractid.MuskDefi}.${DRE.network.name}`).value()).address
  );
};

export const getMuskDefiProxyContract = async (address?: string) => {
  return getContract<TransparentUpgradeableProxy>(
    eContractid.TransparentUpgradeableProxy,
    address ||
      (await getDb().get(`${eContractid.MuskDefi}.${DRE.network.name}`).value())
        .address
  );
};

export const getMuskDefiContract = async (address?: string) => {
  return getContract<MuskDefi>(
    eContractid.MuskDefi,
    address || (await getDb().get(`${eContractid.MuskDefi}.${DRE.network.name}`).value()).address
  );
};

export const getTransparentUpgradeableProxyContract = async (address?: string) => {
  return getContract<MuskDefi>(
    eContractid.TransparentUpgradeableProxy,
    address ||
      (await getDb().get(`${eContractid.TransparentUpgradeableProxy}.${DRE.network.name}`).value())
        .address
  );
};

export const getSellTokenContract = async (address?: string) => {
  return getContract<SellToken>(
    eContractid.SellToken,
    address || (await getDb().get(`${eContractid.SellToken}.${DRE.network.name}`).value()).address
  );
};
