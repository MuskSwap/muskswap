// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import './libs/math/SafeMath.sol';
import './libs/token/BEP20/IBEP20.sol';
import './libs/token/BEP20/SafeBEP20.sol';
import "./libs/proxy/Initializable.sol";
import "./MuskOwnable.sol";
import "./MuskToken.sol";
import "./MuskProofOfStake.sol";

interface IMigratorChef {
    function migrate(IBEP20 token) external returns (IBEP20);
}

contract MuskDefi is MuskOwnable, Initializable {
    using SafeMath for uint256;
    using SafeBEP20 for IBEP20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of MUSKs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accMuskPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accMuskPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IBEP20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. MUSKs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that MUSKs distribution occurs.
        uint256 accMuskPerShare; // Accumulated MUSKs per share, times 1e12. See below.
        uint256 depositFee;
    }

    MuskToken public musk;
    MuskProofOfStake public muskpos;
    uint256 public emissionRate;
    uint256 public MIN_THRESHOLD_LVL1;
    uint256 public MIN_THRESHOLD_LVL2;
    address public devaddr;
    IMigratorChef public migrator;
    mapping(address => address) public referrers;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint;
    // The block number when MUSK mining starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event NewReferral(address indexed user, address indexed ref, uint8 indexed level);
    event EarnRefBonus(address indexed user, address indexed ref, uint8 indexed level, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

    constructor() public {
    }

    function initialize(
        MuskToken _musk,
        MuskProofOfStake _muskpos,
        address _owner,
        address _devaddr
    ) public initializer {
        initOwner(_owner);
        devaddr = _devaddr;
        startBlock = block.number;
        musk = _musk;
        muskpos = _muskpos;
        emissionRate = 100e18;
        MIN_THRESHOLD_LVL1 = 100e18;
        MIN_THRESHOLD_LVL2 = 1000e18;

        poolInfo.push(PoolInfo({
            lpToken: _musk,
            allocPoint: 50000,
            lastRewardBlock: startBlock,
            accMuskPerShare: 0,
            depositFee: 0
        }));

        totalAllocPoint = 50000;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(uint256 _allocPoint, IBEP20 _lpToken, uint256 _depositFee, bool _withUpdate) public onlyOwner {
        require(_depositFee <= 10000, "add: invalid deposit fee basis points");
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            allocPoint: _allocPoint,
            lastRewardBlock: lastRewardBlock,
            accMuskPerShare: 0,
            depositFee: _depositFee
        }));
    }

    // Update the given pool's MUSK allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, uint256 _depositFee, bool _withUpdate) public onlyOwner {
        require(_depositFee <= 10000, "set: invalid deposit fee basis points");
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 prevAllocPoint = poolInfo[_pid].allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
        poolInfo[_pid].depositFee = _depositFee;
        if (prevAllocPoint != _allocPoint) {
            totalAllocPoint = totalAllocPoint.sub(prevAllocPoint).add(_allocPoint);
        }
    }

    function updateMinStakingThreshold(uint256 _min1, uint256 _min2) public onlyOwner {
        MIN_THRESHOLD_LVL1 = _min1;
        MIN_THRESHOLD_LVL2 = _min2;
    }

    function sendReward(address _to, uint256 _amount) internal {
        address refLvl1 = referrers[msg.sender];
        address refLvl2 = referrers[refLvl1];
        if (musk.balanceOf(refLvl1) >= MIN_THRESHOLD_LVL1) {
            uint256 bonusRefLvl1 = _amount.mul(6).div(100);
            muskpos.safeMuskTransfer(refLvl1, bonusRefLvl1);
            emit EarnRefBonus(refLvl1, msg.sender, 1, bonusRefLvl1);
        }
        if (refLvl2 != address(0) && musk.balanceOf(refLvl2) >= MIN_THRESHOLD_LVL2) {
            uint256 bonusRefLvl2 = _amount.mul(2).div(100);
            muskpos.safeMuskTransfer(refLvl2, bonusRefLvl2);
            emit EarnRefBonus(refLvl2, msg.sender, 2, bonusRefLvl2);
        }
        muskpos.safeMuskTransfer(devaddr, _amount.mul(8).div(100));
        muskpos.sendReward(_to, _amount);
    }

    // Set the migrator contract. Can only be called by the owner.
    function setMigrator(IMigratorChef _migrator) public onlyOwner {
        migrator = _migrator;
    }

    // Migrate lp token to another lp contract. Can be called by anyone. We trust that migrator contract is good.
    function migrate(uint256 _pid) public {
        require(address(migrator) != address(0), "migrate: no migrator");
        PoolInfo storage pool = poolInfo[_pid];
        IBEP20 lpToken = pool.lpToken;
        uint256 bal = lpToken.balanceOf(address(this));
        lpToken.safeApprove(address(migrator), bal);
        IBEP20 newLpToken = migrator.migrate(lpToken);
        require(bal == newLpToken.balanceOf(address(this)), "migrate: bad");
        pool.lpToken = newLpToken;
    }

    // View function to see pending MUSKs on frontend.
    function pendingVision(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accMuskPerShare = pool.accMuskPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 muskReward = emissionRate.mul(block.number.sub(pool.lastRewardBlock))
                .mul(pool.allocPoint).div(totalAllocPoint);
            accMuskPerShare = accMuskPerShare.add(muskReward.mul(1e12).div(lpSupply));
        }
        return user.amount.mul(accMuskPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 muskReward = emissionRate.mul(block.number.sub(pool.lastRewardBlock))
            .mul(pool.allocPoint).div(totalAllocPoint);
        musk.mintTo(address(muskpos), muskReward.mul(116).div(100));
        pool.accMuskPerShare = pool.accMuskPerShare.add(muskReward.mul(1e12).div(lpSupply));
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for MUSK allocation.
    function deposit(uint256 _pid, uint256 _amount, address _referrer) public {
        require (_pid != 0, 'deposit MUSK by staking');
        if (referrers[msg.sender] == address(0)
            && _referrer != address(0)
            && msg.sender != _referrer
            && msg.sender != referrers[_referrer]) {
            referrers[msg.sender] = _referrer;
            emit NewReferral(_referrer, msg.sender, 1);
            if (referrers[_referrer] != address(0)) {
                emit NewReferral(referrers[_referrer], msg.sender, 2);
            }
        }
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accMuskPerShare).div(1e12).sub(user.rewardDebt);
            if(pending > 0) {
                sendReward(msg.sender, pending);
            }
        }
        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            if (pool.depositFee > 0) {
                uint256 depositFee = _amount.mul(pool.depositFee).div(10000);
                user.amount = user.amount.add(_amount).sub(depositFee);
            } else {
                user.amount = user.amount.add(_amount);
            }
        }
        user.rewardDebt = user.amount.mul(pool.accMuskPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public {
        require (_pid != 0, 'withdraw MUSK by unstaking');
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accMuskPerShare).div(1e12).sub(user.rewardDebt);
        if(pending > 0) {
            sendReward(msg.sender, pending);
        }
        if(_amount > 0) {
            if (pool.depositFee > 0) {
                uint256 depositFee = _amount.mul(pool.depositFee).div(10000);
                pool.lpToken.safeTransfer(address(msg.sender), _amount - depositFee);
            } else {
                pool.lpToken.safeTransfer(address(msg.sender), _amount);
            }
            user.amount = user.amount.sub(_amount);
        }
        user.rewardDebt = user.amount.mul(pool.accMuskPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Stake MUSK tokens to MasterChef
    function enterStaking(uint256 _amount, address _referrer) public {
        if (referrers[msg.sender] == address(0)
            && _referrer != address(0)
            && msg.sender != _referrer
            && msg.sender != referrers[_referrer]) {
            referrers[msg.sender] = _referrer;
            emit NewReferral(_referrer, msg.sender, 1);
            if (referrers[_referrer] != address(0)) {
                emit NewReferral(referrers[_referrer], msg.sender, 2);
            }
        }
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][msg.sender];
        updatePool(0);
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accMuskPerShare).div(1e12).sub(user.rewardDebt);
            if(pending > 0) {
                sendReward(msg.sender, pending);
            }
        }
        if(_amount > 0) {
            pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            user.amount = user.amount.add(_amount);
        }
        user.rewardDebt = user.amount.mul(pool.accMuskPerShare).div(1e12);

        muskpos.mintTo(msg.sender, _amount);
        emit Deposit(msg.sender, 0, _amount);
    }

    // Withdraw MUSK tokens from STAKING.
    function leaveStaking(uint256 _amount) public {
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool(0);
        uint256 pending = user.amount.mul(pool.accMuskPerShare).div(1e12).sub(user.rewardDebt);
        if(pending > 0) {
            sendReward(msg.sender, pending);
        }
        if(_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(pool.accMuskPerShare).div(1e12);

        muskpos.burnFrom(msg.sender, _amount);
        emit Withdraw(msg.sender, 0, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "dev: wut?");
        devaddr = _devaddr;
    }
}
