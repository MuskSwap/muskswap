import { task } from "hardhat/config";
import { checkVerification } from "../../helpers/etherscan-verification";
// import { ConfigNames } from "../../helpers/configuration";
import { printContracts } from "../../helpers/misc-utils";
import { eContractid } from "../../helpers/types";

task("elon:dev", "Deploy development enviroment")
  .addFlag("verify", "Verify contracts at Etherscan")
  .setAction(async ({ verify }, localBRE) => {
    // const POOL_NAME = ConfigNames.Aave;

    await localBRE.run("set-dre");

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification();
    }

    console.log("Migration started\n");

    console.log("1. Deploy MUSK tokens");
    await localBRE.run(`deploy-${eContractid.MuskToken}`, { verify });

    console.log("2. Deploy MUSK POS");
    await localBRE.run(`deploy-${eContractid.MuskProofOfStake}`, { verify });

    console.log("3. Deploy MuskDefi");
    await localBRE.run(`deploy-${eContractid.MuskDefi}`, { verify });

    // console.log("4. Initilize MuskDefi");
    // await localBRE.run(`initilize-${eContractid.MuskDefi}`, { verify });

    // console.log("5. Deploy WETH Gateway");
    // await localBRE.run("full-deploy-weth-gateway", { verify, pool: POOL_NAME });

    // console.log("6. Initialize lending pool");
    // await localBRE.run("dev:initialize-lending-pool", {
    //   verify,
    //   pool: POOL_NAME,
    // });

    console.log("\nFinished migration");
    printContracts();
  });
