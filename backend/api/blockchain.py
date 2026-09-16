from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json

from database.connection import get_db
from database.models import EvidenceRecordModel
from utils.blockchain import build_block_hash, hash_bytes, hash_json, verify_blockchain_chain

router = APIRouter(prefix="/api/blockchain", tags=["Blockchain"])


@router.get("/ledger")
def get_blockchain_ledger(db: Session = Depends(get_db)):
    records = db.query(EvidenceRecordModel).order_by(EvidenceRecordModel.id.asc()).all()
    chain: List[Dict[str, Any]] = []

    records_verified = True
    for record in records:
        payload = {
            "call_id": record.call_id,
            "audio_hash": record.audio_hash,
            "result_hash": record.result_hash,
            "audio_stored": record.audio_data is not None,
        }

        block = {
            "index": record.id,
            "timestamp": record.created_at.isoformat() if record.created_at else "",
            "payload": payload,
            "previous_hash": record.previous_hash,
        }
        block["hash"] = record.evidence_hash
        chain.append(block)
        try:
            stored_result = json.loads(record.result_json)
            records_verified = records_verified and (
                record.result_hash == hash_json(stored_result)
                and record.audio_hash == (
                    hash_bytes(record.audio_data) if record.audio_data is not None else None
                )
            )
        except (TypeError, ValueError, json.JSONDecodeError):
            records_verified = False

    return {
        "chain": chain,
        "verified": records_verified and verify_blockchain_chain(chain),
    }


@router.get("/verify/{call_id}")
def verify_evidence(call_id: str, db: Session = Depends(get_db)):
    record = db.query(EvidenceRecordModel).filter(EvidenceRecordModel.call_id == call_id).first()
    if not record:
        return {"call_id": call_id, "found": False, "verified": False}

    result_payload = json.loads(record.result_json)
    payload = {
        "call_id": record.call_id,
        "audio_hash": record.audio_hash,
        "result_hash": record.result_hash,
    }
    block = {
        "index": record.id,
        "timestamp": record.created_at.isoformat() if record.created_at else "",
        "payload": payload,
        "previous_hash": record.previous_hash,
    }
    recalculated_result_hash = hash_json(result_payload)
    recalculated_audio_hash = hash_bytes(record.audio_data) if record.audio_data is not None else None
    recalculated_evidence_hash = build_block_hash(block)
    verified = (
        record.result_hash == recalculated_result_hash
        and record.audio_hash == recalculated_audio_hash
        and record.evidence_hash == recalculated_evidence_hash
    )
    return {
        "call_id": call_id,
        "found": True,
        "verified": verified,
        "audio_hash": record.audio_hash,
        "result_hash": record.result_hash,
        "evidence_hash": record.evidence_hash,
    }
