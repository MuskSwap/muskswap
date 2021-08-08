import { task } from "hardhat/config";
import { checkVerification } from "../../helpers/etherscan-verification";
// import { ConfigNames } from "../../helpers/configuration";
import { printContracts } from "../../helpers/misc-utils";
import { eContractid } from "../../helpers/types";

task("ido:dev", "Deploy IDO development enviroment")
  .addFlag("verify", "Verify contracts at Etherscan")
  .setAction(async ({ verify }, localBRE) => {
    // const POOL_NAME = ConfigNames.Aave;

    await localBRE.run("set-dre");

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification();
    }

    console.log("Migration started\n");

    // console.log("1. Deploy Elon tokens");
    // await localBRE.run(`deploy-${eContractid.ElonToken}`, { verify });

    // console.log("2. Deploy address provider");
    // await localBRE.run(`deploy-${eContractid.ElonProofOfStake}`, { verify });

    // console.log("3. Deploy lending pool");
    // await localBRE.run(`deploy-${eContractid.ElonDefi}`, { verify });

    // console.log("4. Deploy oracles");
    // await localBRE.run("dev:deploy-oracles", { verify, pool: POOL_NAME });

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
