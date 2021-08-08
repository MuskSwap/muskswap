import { utils } from "ethers";
import fs from "fs";
// import chalk from "chalk";
import path from "path";
import { HardhatUserConfig } from "hardhat/config";
// @ts-ignore
import { accounts } from "./test-wallets";

require('dotenv').config();

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@tenderly/hardhat-tenderly";
import "@nomiclabs/hardhat-etherscan";

const { getAddress, formatUnits, parseUnits } = utils;

export const BUIDLEREVM_CHAIN_ID = 31337;

const DEFAULT_BLOCK_GAS_LIMIT = 12500000;
const DEFAULT_GAS_PRICE = 100 * 1000 * 1000 * 1000; // 75 gwei
const HARDFORK = "istanbul";
const INFURA_KEY = process.env.INFURA_KEY || "";
const ETHERSCAN_KEY =
  process.env.ETHERSCAN_KEY || "MN5SN5U4A4PTAI6BNZI6D2SQCMCH5BMXKG";
const MNEMONIC_PATH = "m/44'/60'/0'/0";
const MNEMONIC = process.env.MNEMONIC || "";
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
const SKIP_LOAD = process.env.SKIP_LOAD === "true";
const MAINNET_FORK = process.env.MAINNET_FORK === "true";
const FORKING_BLOCK = parseInt(process.env.FORKING_BLOCK || "11633164");

// Prevent to load scripts before compilation and typechain
if (!SKIP_LOAD) {
  ["misc", "migrations", "deployments"].forEach((folder) => {
    const tasksPath = path.join(__dirname, "tasks", folder);
    fs.readdirSync(tasksPath)
      .filter((pth) => pth.includes(".ts"))
      .forEach((task) => {
        require(`${tasksPath}/${task}`);
      });
  });
}

require(`${path.join(__dirname, "tasks/misc")}/set-DRE.ts`);

const mainnetFork = MAINNET_FORK
  ? {
      blockNumber: FORKING_BLOCK,
      url: ALCHEMY_KEY
        ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`
        : `https://main.infura.io/v3/${INFURA_KEY}`,
    }
  : undefined;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: "istanbul",
        },
      },
      // {
      //   version: '0.7.5',
      //   settings: {
      //     optimizer: { enabled: true, runs: 200 },
      //     evmVersion: 'istanbul',
      //   },
      // },
    ],
  },
  typechain: {
    outDir: "types",
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
  defaultNetwork: "hardhat",
  mocha: {
    timeout: 0,
  },
  networks: {
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: DEFAULT_GAS_PRICE,
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      accounts: [],
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: DEFAULT_GAS_PRICE,
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      accounts: [],
    },
    hardhat: {
      hardfork: "istanbul",
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: DEFAULT_GAS_PRICE,
      chainId: BUIDLEREVM_CHAIN_ID,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      accounts: accounts.map(
        ({ secretKey, balance }: { secretKey: string; balance: string }) => ({
          privateKey: secretKey,
          balance,
        }),
      ),
      forking: mainnetFork,
    },
    ganache: {
      url: "http://ganache:8545",
      accounts: {
        mnemonic:
          "fox sight canyon orphan hotel grow hedgehog build bless august weather swarm",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
    coverage: {
      url: "http://localhost:8555",
    },
  },
};

export default config;
