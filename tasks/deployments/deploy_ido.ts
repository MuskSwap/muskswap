import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { getMuskTokenContract, getSellTokenContract } from '../../helpers/contracts-accessors';
import { deployContract } from '../../helpers/contracts-helpers';
import { SellToken } from '../../types';
import { verifyContract } from '../../helpers/etherscan-verification';

task(`deploy-${eContractid.SellToken}`, `Deploy ${eContractid.SellToken} contract`)
  .addFlag('verify', `Verify ${eContractid.SellToken} contract via Etherscan API.`)
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    const firstSigner = (await localBRE.ethers.getSigners())[0];

    const idoAdmin = firstSigner.address;
    const busdAddress = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
    const buyToken = busdAddress;
    console.log(`\n- Deploying ${eContractid.SellToken} ...`);

    const muskToken = await getMuskTokenContract();
    console.log(`\n- MuskToken ${muskToken.address} ...`);
    const args: string[] = [idoAdmin, buyToken, muskToken.address];
    const sellToken = await deployContract<SellToken>(eContractid.SellToken, args);
    await sellToken.deployTransaction.wait();

    if (verify) {
      await verifyContract(eContractid.SellToken, sellToken.address, args);
    }

    console.log(`\tFinished ${eContractid.SellToken}`);
  });

task(`verify-${eContractid.SellToken}`, `Verify the ${eContractid.SellToken} contract`).setAction(
  async ({}, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Verifying ${eContractid.SellToken}`);

    const firstSigner = (await localBRE.ethers.getSigners())[0];

    const idoAdmin = firstSigner.address;
    const buyToken = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
    console.log(`\n- Deploying ${eContractid.SellToken} ...`);

    const muskToken = await getMuskTokenContract();
    console.log(`\n- MuskToken ${muskToken.address} ...`);
    const args: string[] = [idoAdmin, buyToken, muskToken.address];

    const sellToken = await getSellTokenContract();
    await verifyContract(eContractid.SellToken, sellToken.address, args);

    console.log(`\tFinished ${eContractid.SellToken}`);
  }
);
