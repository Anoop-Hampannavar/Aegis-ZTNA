// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AccessLog {
    struct LogEntry {
        string userAddress;
        string resourceRequested;
        uint256 timestamp;
        string riskLevel;
        string status;
    }

    LogEntry[] private logs;
    address public admin;

    event LogRecorded(string userAddress, string resource, string riskLevel, string status);

    modifier sincerelyAdmin() {
        require(msg.sender == admin, "Execution restricted to authorized system gateway.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function recordAccess(
        string memory _user, 
        string memory _resource, 
        string memory _risk, 
        string memory _status
    ) public sincerelyAdmin {
        logs.push(LogEntry(_user, _resource, block.timestamp, _risk, _status));
        emit LogRecorded(_user, _resource, _risk, _status);
    }

    function getLogs() public view returns (LogEntry[] memory) {
        return logs;
    }
}