import { eEthereumNetwork, tEthereumAddress } from './types';
import { getParamPerNetwork } from './misc-utils';

export const MAX_UINT_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export const MOCK_ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
export const WAD = Math.pow(10, 18).toString();
export const COOLDOWN_SECONDS = '3600'; // 1 hour in seconds
export const UNSTAKE_WINDOW = '1800'; // 30 min in seconds
export const DISTRIBUTION_DURATION = '86400'; // 1 day in seconds

export const STAKED_AAVE_NAME = 'Staked Aave';
export const STAKED_AAVE_SYMBOL = 'stkAAVE';
export const STAKED_AAVE_DECIMALS = 18;

export const AAVE_GOVERNANCE_V2 = '0xEC568fffba86c094cf06b22134B23074DFE2252c';
export const UPGRADABLE_CRP_FACTORY = '0x1156C30b08DbF16281c803EAe0d52Eee7652f10C';
export const AAVE_TOKEN = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
export const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
export const REWARDS_VAULT = '0x25f2226b597e8f9514b3f68f00f494cf4f286491';
export const BPOOL_FACTORY = '0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd';

export const CRP_IMPLEMENTATION = '0xadc74a134082ea85105258407159fbb428a73782';
export const SHORT_EXECUTOR = '0xee56e2b3d491590b5b31738cc34d5232f378a8d5';
export const LONG_EXECUTOR = '0x61910EcD7e8e942136CE7Fe7943f956cea1CC2f7';
export const PROXY_CRP_ADMIN = SHORT_EXECUTOR;
export const RESERVE_CONTROLER = '0x1E506cbb6721B83B1549fa1558332381Ffa61A93';
export const ZERO_ADDRESS: tEthereumAddress = '0x0000000000000000000000000000000000000000';

export const PROXY_ADMIN_ADDRESS = '0xc0ffEe3e342826ab57f158550A8D528c858EA88C';

// PEI constants
export const PSM_STAKER_PREMIUM = '2';

// just junk mock

export const RANDOM_ADDRESSES = [
  '0x0000000000000000000000000000000000000221',
  '0x0000000000000000000000000000000000000321',
  '0x0000000000000000000000000000000000000211',
  '0x0000000000000000000000000000000000000251',
  '0x0000000000000000000000000000000000000271',
  '0x0000000000000000000000000000000000000291',
  '0x0000000000000000000000000000000000000321',
  '0x0000000000000000000000000000000000000421',
  '0x0000000000000000000000000000000000000521',
  '0x0000000000000000000000000000000000000621',
  '0x0000000000000000000000000000000000000721',
];

export const getBusdTokenPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
      [eEthereumNetwork.bsctest]: '0x91f44aF93F784ae7Ce939913f45636Ce3d864207',
      [eEthereumNetwork.bsc]: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    },
    network
  );

export const getUsdtTokenPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
      [eEthereumNetwork.bsctest]: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      [eEthereumNetwork.bsc]: '0x55d398326f99059ff775485246999027b3197955',
    },
    network
  );

export const getEthTokenPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
      [eEthereumNetwork.bsctest]: '0x64EBfe8706ce9160CD5a66b7e01349E2158E74f5',
      [eEthereumNetwork.bsc]: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    },
    network
  );

export const getBtcbTokenPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
      [eEthereumNetwork.bsctest]: '0x5bF1Ae38c338fB1D9B2eCE2dA26287ae618C14B2',
      [eEthereumNetwork.bsc]: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    },
    network
  );

export const getUsdcTokenPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
  getParamPerNetwork<tEthereumAddress>(
    {
      [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
      [eEthereumNetwork.bsctest]: '0x9780881Bf45B83Ee028c4c1De7e0C168dF8e9eEF',
      [eEthereumNetwork.bsc]: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    },
    network
  );

// export const getAaveTokenPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
//   getParamPerNetwork<tEthereumAddress>(
//     {
//       [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
//       [eEthereumNetwork.bsctest]: '0x20D15A7428249248d2d8Dc29fBc7D52CAA76eB4d',
//     },
//     network
//   );

// export const getCooldownSecondsPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
//   getParamPerNetwork<string>(
//     {
//       [eEthereumNetwork.hardhat]: COOLDOWN_SECONDS,
//       [eEthereumNetwork.bsctest]: '180', // 3m
//     },
//     network
//   );

// export const getUnstakeWindowPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
//   getParamPerNetwork<string>(
//     {
//       [eEthereumNetwork.hardhat]: UNSTAKE_WINDOW,
//       [eEthereumNetwork.bsctest]: '240', // 4m
//     },
//     network
//   );

// export const getAaveAdminPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
//   getParamPerNetwork<tEthereumAddress>(
//     {
//       [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
//       [eEthereumNetwork.bsctest]: '0x5E99Ba866b9024cf95BF29151CE2a6540689b20F', // Aave Governance
//     },
//     network
//   );

// export const getDistributionDurationPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
//   getParamPerNetwork<tEthereumAddress>(
//     {
//       [eEthereumNetwork.hardhat]: DISTRIBUTION_DURATION,
//       [eEthereumNetwork.bsctest]: '864000',
//     },
//     network
//   );

// export const getAaveIncentivesVaultPerNetwork = (network: eEthereumNetwork): tEthereumAddress =>
//   getParamPerNetwork<tEthereumAddress>(
//     {
//       [eEthereumNetwork.hardhat]: '',
//       [eEthereumNetwork.bsctest]: '0x47E70D1511593935c62b6c1ff97AaeA67f656409',
//     },
//     network
//   );
