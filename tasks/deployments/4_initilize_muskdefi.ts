import { task } from 'hardhat/config';
import { eContractid } from '../../helpers/types';
import {
  getMuskDefiImplContract,
  getMuskDefiProxyContract,
  getMuskPosContract,
  getMuskTokenContract,
} from '../../helpers/contracts-accessors';
import { waitForTx } from '../../helpers/misc-utils';
import { verifyContract } from '../../helpers/etherscan-verification';
import { PROXY_ADMIN_ADDRESS } from '../../helpers/constants';

task(`initilize-${eContractid.MuskDefi}`, `Initialize the ${eContractid.MuskDefi} contract`)
  .addFlag('verify', `Verify ${eContractid.MuskDefi} contract via Etherscan API.`)
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-dre');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }

    const firstSigner = (await localBRE.ethers.getSigners())[0];

    console.log(`\n- Initialize ${eContractid.MuskDefi}...`);

    const devAddress = '0xAA38ce89B306174152c8D8C8Bd84d436f30B20f1';
    const muskTokenContract = await getMuskTokenContract();
    const muskPosTokenContract = await getMuskPosContract();
    const muskDefiImplContract = await getMuskDefiImplContract();
    const muskDefiProxyContract = await getMuskDefiProxyContract();

    const encodedInitializeMuskDefi = muskDefiImplContract.interface.encodeFunctionData(
      'initialize',
      [muskTokenContract.address, muskPosTokenContract.address, devAddress, devAddress]
    );

    await waitForTx(
      // @ts-ignore
      await muskDefiProxyContract.functions['initialize(address,address,bytes)'](
        muskDefiImplContract.address,
        PROXY_ADMIN_ADDRESS,
        encodedInitializeMuskDefi
      )
    );

    if (verify) {
      await verifyContract(
        eContractid.MuskDefi,
        muskDefiProxyContract.address,
        [muskDefiImplContract.address, PROXY_ADMIN_ADDRESS, encodedInitializeMuskDefi],
        undefined,
        'contracts/MuskDefiProxy.sol:MuskDefiProxy'
      );
    }

    console.log(`\tFinished Proxy initialization ${eContractid.MuskDefi}`);
  });
