import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { waitForTx } from '../../helpers/misc-utils';
import { deployContract } from '../../helpers/contracts-helpers';
import { verifyContract } from '../../helpers/etherscan-verification';
import { getMuskTokenContract } from '../../helpers/contracts-accessors';

task(`deploy-${eContractid.MuskToken}`, `Initialize the ${eContractid.MuskToken} contract`)
  .addFlag('verify', `Verify ${eContractid.MuskToken} contract via Etherscan API.`)
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Deploying ${eContractid.MuskToken}...`);

    const muskToken = await deployContract(eContractid.MuskToken, []);
    await muskToken.deployTransaction.wait();
    if (verify) {
      await verifyContract(eContractid.MuskToken, muskToken.address, []);
    }

    console.log(`\tFinished ${eContractid.MuskToken}`);
  });

task(`verify-${eContractid.MuskToken}`, `Verify the ${eContractid.MuskToken} contract`).setAction(
  async ({}, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Verifying ${eContractid.MuskToken}`);

    const muskToken = await getMuskTokenContract();
    await verifyContract(eContractid.MuskToken, muskToken.address, []);

    console.log(`\tFinished ${eContractid.MuskToken}`);
  }
);

task(`mint-${eContractid.MuskToken}`, `Mint the ${eContractid.MuskToken}`).setAction(
  async ({}, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Mint ${eContractid.MuskToken}`);

    const muskToken = await getMuskTokenContract();
    const tx = await muskToken.mint(localBRE.ethers.utils.parseEther('300000000000000'), {
      gasLimit: 300000,
    });
    await tx.wait();
    // const cap = await muskToken.cap()
    // console.log(cap.toString())

    console.log(`\tFinished mint ${eContractid.MuskToken}`);
  }
);
