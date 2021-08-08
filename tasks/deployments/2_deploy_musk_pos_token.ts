import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { waitForTx } from '../../helpers/misc-utils';
import { deployContract, registerContractInJsonDb } from '../../helpers/contracts-helpers';
import { verifyContract } from '../../helpers/etherscan-verification';
import { getMuskTokenContract } from '../../helpers/contracts-accessors';

task(
  `deploy-${eContractid.MuskProofOfStake}`,
  `Deploy the ${eContractid.MuskProofOfStake} contract`
)
  .addFlag('verify', `Verify ${eContractid.MuskProofOfStake} contract via Etherscan API.`)
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Deploying ${eContractid.MuskProofOfStake}...`);

    const muskToken = await getMuskTokenContract();
    const muskPos = await deployContract(eContractid.MuskProofOfStake, [muskToken.address]);
    await muskPos.deployTransaction.wait();

    if (verify) {
      await verifyContract(eContractid.MuskProofOfStake, muskPos.address, [muskToken.address]);
    }

    console.log(`\tFinished ${eContractid.MuskProofOfStake}`);
  });
