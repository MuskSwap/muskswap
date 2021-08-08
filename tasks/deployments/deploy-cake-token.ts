import { task } from "hardhat/config";
import { eContractid } from "../../helpers/types";
import { waitForTx } from "../../helpers/misc-utils";
import {
  deployContract,
  registerContractInJsonDb,
} from "../../helpers/contracts-helpers";
import { verifyContract } from "../../helpers/etherscan-verification";

task(
  `deploy-${eContractid.CakeToken}`,
  `Initialize the ${eContractid.CakeToken} contract`,
)
  .addFlag(
    "verify",
    `Verify ${eContractid.CakeToken} contract via Etherscan API.`,
  )
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run("set-dre");

    if (!localBRE.network.config.chainId) {
      throw new Error("INVALID_CHAIN_ID");
    }

    console.log(`\n- ${eContractid.CakeToken} initialization`);

    const cakeToken = await deployContract(eContractid.CakeToken, []);
    await cakeToken.deployTransaction.wait();
    if (verify) {
      await verifyContract(eContractid.CakeToken, cakeToken.address, []);
    }
    await registerContractInJsonDb(eContractid.CakeToken, cakeToken);

    console.log(`\tFinished ${eContractid.CakeToken}`);
  });
