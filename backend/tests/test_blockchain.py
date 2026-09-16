import hashlib

from utils.blockchain import build_block_hash, verify_blockchain_chain


def test_build_block_hash_and_verify_chain():
    payload = {
        "report_id": "VG-20260904-48291",
        "caller_name": "Unknown Caller",
        "risk_score": 94,
        "status": "SUBMITTED_TO_CYBER_CELL",
    }

    block_1 = {
        "index": 1,
        "payload": payload,
        "previous_hash": "0" * 64,
        "timestamp": "2026-09-15T00:00:00Z",
    }

    block_1_hash = build_block_hash(block_1)
    block_2 = {
        "index": 2,
        "payload": {**payload, "status": "BLOCKED_AND_LOGGED"},
        "previous_hash": block_1_hash,
        "timestamp": "2026-09-15T00:01:00Z",
    }

    block_2_hash = build_block_hash(block_2)

    assert len(block_1_hash) == 64
    assert len(block_2_hash) == 64
    assert verify_blockchain_chain([block_1, block_2]) is True

    tampered = dict(block_2)
    tampered["payload"] = {**tampered["payload"], "risk_score": 99}
    assert verify_blockchain_chain([block_1, tampered]) is False
