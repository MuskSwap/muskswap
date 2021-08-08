pragma solidity 0.6.12;

import './libs/proxy/TransparentUpgradeableProxy.sol';

contract MuskDefiProxy is TransparentUpgradeableProxy {
  constructor(
    address logic,
    address admin,
    bytes memory data
  ) public TransparentUpgradeableProxy(logic, admin, data) {}
}
