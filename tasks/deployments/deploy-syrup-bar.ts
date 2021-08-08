import { task } from "hardhat/config";
import { eContractid } from "../../helpers/types";
import { waitForTx } from "../../helpers/misc-utils";
import {
  deployContract,
  registerContractInJsonDb,
} from "../../helpers/contracts-helpers";
import { verifyContract } from "../../helpers/etherscan-verification";
import { getCakeTokenContract } from "../../helpers/contracts-accessors";

task(
  `deploy-${eContractid.SyrupBar}`,
  `Initialize the ${eContractid.SyrupBar} contract`,
)
  .addFlag(
    "verify",
    `Verify ${eContractid.SyrupBar} contract via Etherscan API.`,
  )
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run("set-dre");

    if (!localBRE.network.config.chainId) {
      throw new Error("INVALID_CHAIN_ID");
    }

    console.log(`\n- Deploying ${eContractid.SyrupBar} ...`);

    const cakeToken = await getCakeTokenContract();
    console.log(
      "🚀 ~ file: deploy-syrup-bar.ts ~ line 29 ~ .setAction ~ cakeToken",
      cakeToken.address,
    );

    const syrupBar = await deployContract(eContractid.SyrupBar, [
      cakeToken.address,
    ]);
    await syrupBar.deployTransaction.wait();

    if (verify) {
      await verifyContract(eContractid.SyrupBar, syrupBar.address, [
        cakeToken.address,
      ]);
    }

    await registerContractInJsonDb(eContractid.SyrupBar, syrupBar);

    console.log(`\tFinished ${eContractid.SyrupBar}`);
  });
