// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessLog {
    struct LogEntry {
        uint256 timestamp;
        string userId;
        string targetResource;
        uint256 riskScorePercentage;
        string decisionStatus;
    }

    LogEntry[] public auditLogs;

    event AccessRecorded(
        uint256 indexed timestamp,
        string userId,
        string targetResource,
        uint256 riskScorePercentage,
        string decisionStatus
    );

    function logAccess(
        string memory _userId,
        string memory _targetResource,
        uint256 _riskScorePercentage,
        string memory _decisionStatus
    ) public returns (uint256 logId) {
        auditLogs.push(LogEntry({
            timestamp: block.timestamp,
            userId: _userId,
            targetResource: _targetResource,
            riskScorePercentage: _riskScorePercentage,
            decisionStatus: _decisionStatus
        }));

        emit AccessRecorded(
            block.timestamp,
            _userId,
            _targetResource,
            _riskScorePercentage,
            _decisionStatus
        );

        return auditLogs.length - 1;
    }

    function getLogCount() public view returns (uint256) {
        return auditLogs.length;
    }
}
