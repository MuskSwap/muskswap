import { task } from "hardhat/config";
import { eContractid } from "../../helpers/types";
import { waitForTx } from "../../helpers/misc-utils";
import {
  deployContract,
  registerContractInJsonDb,
} from "../../helpers/contracts-helpers";
import {
  getCakeTokenContract,
  getSyrupBarContract,
} from "../../helpers/contracts-accessors";
import { verifyContract } from "../../helpers/etherscan-verification";

task(
  `deploy-${eContractid.MasterChef}`,
  `Deploy the ${eContractid.MasterChef} contract`,
)
  .addFlag(
    "verify",
    `Verify ${eContractid.MasterChef} contract via Etherscan API.`,
  )
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run("set-dre");

    if (!localBRE.network.config.chainId) {
      throw new Error("INVALID_CHAIN_ID");
    }

    console.log(`\n- Deploying ${eContractid.MasterChef} ...`);

    const cakePerBlock = 100;
    const startBlock = 10438344;
    const devAddress = "0xAA38ce89B306174152c8D8C8Bd84d436f30B20f1";
    const cakeTokenContract = await getCakeTokenContract();
    const syrupBarContract = await getSyrupBarContract();
    const masterchef = await deployContract(eContractid.MasterChef, [
      cakeTokenContract.address,
      syrupBarContract.address,
      devAddress,
      cakePerBlock,
      startBlock,
    ]);
    await masterchef.deployTransaction.wait();

    if (verify) {
      await verifyContract(eContractid.MasterChef, masterchef.address, []);
    }
    await registerContractInJsonDb(eContractid.MasterChef, masterchef);

    console.log(`\tFinished deploy ${eContractid.MasterChef}`);
  });
