import hashlib
import json
from datetime import datetime, timezone
from typing import Any, Dict, List


def _canonical_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), default=str)


def hash_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def hash_json(value: Any) -> str:
    return hashlib.sha256(_canonical_json(value).encode("utf-8")).hexdigest()


def build_block_hash(block: Dict[str, Any]) -> str:
    block_without_hash = {
        key: value for key, value in block.items() if key != "hash"
    }
    serialized = _canonical_json(block_without_hash)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def create_block(index: int, payload: Dict[str, Any], previous_hash: str = "0" * 64) -> Dict[str, Any]:
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    block = {
        "index": index,
        "timestamp": timestamp,
        "payload": payload,
        "previous_hash": previous_hash,
    }
    block["hash"] = build_block_hash(block)
    return block


def verify_blockchain_chain(blocks: List[Dict[str, Any]]) -> bool:
    if blocks and blocks[0].get("previous_hash") != "0" * 64:
        return False
    for i in range(1, len(blocks)):
        previous = blocks[i - 1]
        current = blocks[i]
        if current.get("previous_hash") != previous.get("hash"):
            return False
        if current.get("hash") != build_block_hash(current):
            return False
    if not blocks:
        return True
    return blocks[0].get("hash") == build_block_hash(blocks[0])


def append_block(chain: List[Dict[str, Any]], payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    previous_hash = chain[-1]["hash"] if chain else "0" * 64
    new_block = create_block(len(chain) + 1, payload, previous_hash)
    chain.append(new_block)
    return chain
