import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { waitForTx } from '../../helpers/misc-utils';
import { deployContract, registerContractInJsonDb } from '../../helpers/contracts-helpers';
import { verifyContract } from '../../helpers/etherscan-verification';

task(`deploy-${eContractid.Multicall}`, `Deploy the ${eContractid.Multicall} contract`)
  .addFlag('verify', `Verify ${eContractid.Multicall} contract via Etherscan API.`)
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Deploying ${eContractid.Multicall} `);

    const multiCall = await deployContract(eContractid.Multicall, []);
    await multiCall.deployTransaction.wait();
    if (verify) {
      await verifyContract(eContractid.Multicall, multiCall.address, []);
    }

    console.log(`\tFinished ${eContractid.Multicall}`);
  });
