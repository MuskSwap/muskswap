import { task, types } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import { getMuskDefiContract, getMuskDefiImplContract } from '../../helpers/contracts-accessors';

task(`add-pool`, `Add pool to the ${eContractid.MuskDefi} contract`)
  .addParam('lpAddress', `Pool token lpAddress`, undefined, types.string)
  .addParam('allocPoint', `The alloc point of the pool`, 1, types.int)
  .setAction(async ({ lpAddress, allocPoint }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Set pool ${lpAddress} ...`);

    const muskdefiContract = await getMuskDefiContract();
    const tx = await muskdefiContract.add(allocPoint, lpAddress, 500, true);
    await tx.wait();

    console.log(`\tFinished add pool ${lpAddress} to ${eContractid.MuskDefi}`);
  });

task(`get-pool`, `Get pool data for the ${eContractid.MuskDefi} contract`)
  .addParam('id', `Get pool data by id`)
  .setAction(async ({ id }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Get pool ${id} from ${eContractid.MuskDefi} ...`);

    const muskdefiContract = await getMuskDefiContract();
    const tx = await muskdefiContract.poolInfo(0);
    console.log(tx);
    console.log(tx.allocPoint.toString());

    console.log(`\tFinished get pool ${id} of ${eContractid.MuskDefi}`);
  });

task(`update-pool`, `Update pool data for the ${eContractid.MuskDefi} contract`)
  .addParam('id', `The id of the pool`, 0, types.int)
  .addParam('allocPoint', `The alloc point of the pool`, 1, types.int)
  .setAction(async ({ id, allocPoint }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    console.log(`\n- Update pool ${id} of ${eContractid.MuskDefi} ...`);

    const muskdefiContract = await getMuskDefiContract();
    const tx = await muskdefiContract.set(id, allocPoint, 0, true);
    await tx.wait();
    console.log(tx);

    console.log(`\tFinished update pool ${id} of ${eContractid.MuskDefi}`);
  });
