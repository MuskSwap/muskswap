import { task } from 'hardhat/config';
import {
  getMuskDefiImplContract,
  getMuskPosContract,
  getMuskTokenContract,
} from '../../helpers/contracts-accessors';
import fs from 'fs';

task(`write-args`, `Generate arguments.js for verify`).setAction(async ({ verify }, localBRE) => {
  await localBRE.run('set-dre');

  if (!localBRE.network.config.chainId) {
    throw new Error('INVALID_CHAIN_ID');
  }

  const firstSigner = (await localBRE.ethers.getSigners())[0];

  console.log(`\n- Genrating...`);

  const devAddress = firstSigner.address;
  const elonTokenContract = await getMuskTokenContract();
  const elonPosContract = await getMuskPosContract();
  const elonDefiImplContract = await getMuskDefiImplContract();

  const encodedInitializeElonDefi = elonDefiImplContract.interface.encodeFunctionData(
    'initialize',
    [elonTokenContract.address, elonPosContract.address, devAddress, devAddress]
  );

  console.log([elonTokenContract.address, elonPosContract.address, devAddress, devAddress])

  const data = [elonDefiImplContract.address, firstSigner.address, encodedInitializeElonDefi];

  // await elonDefiImplContract.initialize(elonTokenContract.address, elonPosContract.address, firstSigner.address, firstSigner.address)
  // fs.writeFileSync('./arguments.js', `module.exports = ${JSON.stringify(data)};`);

  console.log(`\tFinished generate arguments.js`);
});
