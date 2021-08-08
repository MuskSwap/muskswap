import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { waitForTx } from '../../helpers/misc-utils';
import { deployContract, registerContractInJsonDb } from '../../helpers/contracts-helpers';
import { verifyContract } from '../../helpers/etherscan-verification';
import { getMuskTokenContract } from '../../helpers/contracts-accessors';

task(`deploy-${eContractid.MuskStakeToken}`, `Deploy the ${eContractid.MuskStakeToken} contract`)
  .addFlag('verify', `Verify ${eContractid.MuskStakeToken} contract via Etherscan API.`)
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Deploying ${eContractid.MuskStakeToken}...`);

    const elonToken = await getMuskTokenContract();
    const elonPos = await deployContract(eContractid.MuskStakeToken, [elonToken.address]);
    await elonPos.deployTransaction.wait();

    if (verify) {
      await verifyContract(eContractid.MuskStakeToken, elonPos.address, []);
    }

    console.log(`\tFinished ${eContractid.MuskStakeToken}`);
  });
