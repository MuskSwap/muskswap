import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { deployContract, registerContractInJsonDb } from '../../helpers/contracts-helpers';
import {
  getMuskDefiContract,
  getMuskDefiImplContract,
  getMuskDefiProxyContract,
  getMuskPosContract,
  getMuskTokenContract,
} from '../../helpers/contracts-accessors';
import { verifyContract } from '../../helpers/etherscan-verification';
import { MuskDefi } from '../../types/MuskDefi';
import { TransparentUpgradeableProxy } from '../../types/TransparentUpgradeableProxy';
import { PROXY_ADMIN_ADDRESS } from '../../helpers/constants';
import { MuskDefiProxy } from '../../types';

task(`deploy-${eContractid.MuskDefi}`, `Deploy the ${eContractid.MuskDefi} contract`)
  .addFlag('verify', `Verify ${eContractid.MuskDefi} contract via Etherscan API.`)
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    const firstSigner = (await localBRE.ethers.getSigners())[0];

    console.log(`\n- Deploying ${eContractid.MuskDefi} ...`);

    const devAddress = '0xc7df08FBc891B9535d2D9ca29DB4550842bDBb2C';
    const elonTokenContract = await getMuskTokenContract();
    const elonPosContract = await getMuskPosContract();

    console.log(`\tDeploying ${eContractid.MuskDefiImpl} implementation ...`);

    const muskDefiImplContract = await deployContract<MuskDefi>(eContractid.MuskDefi, []);
    await muskDefiImplContract.deployTransaction.wait();
    await registerContractInJsonDb(eContractid.MuskDefiImpl, muskDefiImplContract);

    if (verify) {
      await verifyContract(eContractid.MuskDefi, muskDefiImplContract.address, []);
    }

    // const muskDefiImplContract = await getMuskDefiImplContract();
    const encodedInitializeElonDefi = muskDefiImplContract.interface.encodeFunctionData(
      'initialize',
      [elonTokenContract.address, elonPosContract.address, firstSigner.address, firstSigner.address]
    );

    console.log(`\tDeploying ${eContractid.MuskDefi} Transparent Proxy ...`);
    const muskDefiProxy = await deployContract<MuskDefiProxy>(
      eContractid.MuskDefiProxy,
      [muskDefiImplContract.address, PROXY_ADMIN_ADDRESS, encodedInitializeElonDefi]
    );
    await muskDefiProxy.deployTransaction.wait();
    await registerContractInJsonDb(eContractid.MuskDefi, muskDefiProxy);

    if (verify) {
      await verifyContract(
        eContractid.MuskDefiProxy,
        muskDefiImplContract.address,
        [muskDefiImplContract.address, PROXY_ADMIN_ADDRESS, encodedInitializeElonDefi]
      );
    }

    console.log(`\tFinished deploy ${eContractid.MuskDefi} proxy and implementation deployment`);
  });

task(`verify-${eContractid.MuskDefi}`, `Verify the ${eContractid.MuskDefi} contract`).setAction(
  async ({}, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Verifying ${eContractid.MuskDefi}`);

    const firstSigner = (await localBRE.ethers.getSigners())[0];

    const devAddress = firstSigner.address;
    const elonTokenContract = await getMuskTokenContract();
    const elonPosContract = await getMuskPosContract();
    const elonDefiImplContract = await getMuskDefiImplContract();

    const encodedInitializeElonDefi = elonDefiImplContract.interface.encodeFunctionData(
      'initialize',
      [elonTokenContract.address, elonPosContract.address, devAddress, devAddress]
    );

    const args = [elonDefiImplContract.address, PROXY_ADMIN_ADDRESS, encodedInitializeElonDefi];

    const muskDefi = await getMuskDefiProxyContract();
    await verifyContract(
      eContractid.MuskDefiProxy,
      muskDefi.address,
      args,
      undefined,
      'contracts/MuskDefiProxy.sol:MuskDefiProxy'
    );

    console.log(`\tFinished ${eContractid.MuskDefi}`);
  }
);

task(`verify-${eContractid.MuskDefiImpl}`, `Verify the ${eContractid.MuskDefiImpl} contract`).setAction(
  async ({}, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Verifying ${eContractid.MuskDefiImpl}`);

    const firstSigner = (await localBRE.ethers.getSigners())[0];

    const muskDefiImpl = await getMuskDefiImplContract();
    await verifyContract(
      eContractid.MuskDefi,
      muskDefiImpl.address,
      [],
      undefined,
      'contracts/MuskDefi.sol:MuskDefi'
    );

    console.log(`\tFinished ${eContractid.MuskDefiImpl}`);
  }
);

task(`set-admin`, `setadmin`).setAction(
  async ({}, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Verifying ${eContractid.MuskDefiImpl}`);

    const firstSigner = (await localBRE.ethers.getSigners())[0];

    const muskDefiProxy = await getMuskDefiProxyContract();
    const tx = await muskDefiProxy.changeAdmin(PROXY_ADMIN_ADDRESS)
    console.log(tx)

    console.log(`\tFinished ${eContractid.MuskDefiImpl}`);
  }
);
