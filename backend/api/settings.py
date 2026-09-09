from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json

from database.connection import get_db
from database.models import SettingModel, CallRecordModel
from models.schemas import SettingsConfig

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("", response_model=SettingsConfig)
def get_settings(db: Session = Depends(get_db)):
    settings_rows = db.query(SettingModel).all()
    s_map = {row.key: row.value for row in settings_rows}

    return SettingsConfig(
        ai_detection_enabled=s_map.get("ai_detection_enabled", "true").lower() == "true",
        real_time_protection=s_map.get("real_time_protection", "true").lower() == "true",
        auto_call_recording=s_map.get("auto_call_recording", "false").lower() == "true",
        threat_notifications=s_map.get("threat_notifications", "true").lower() == "true",
        trusted_contact_alerts=s_map.get("trusted_contact_alerts", "true").lower() == "true",
        high_risk_call_blocking=s_map.get("high_risk_call_blocking", "true").lower() == "true",
        sensitivity_level=s_map.get("sensitivity_level", "High"),
        local_edge_processing=s_map.get("local_edge_processing", "true").lower() == "true",
        data_retention_days=int(s_map.get("data_retention_days", 30)),
        voice_profile_storage=s_map.get("voice_profile_storage", "true").lower() == "true"
    )

@router.put("", response_model=SettingsConfig)
def update_settings(config: SettingsConfig, db: Session = Depends(get_db)):
    fields = config.dict()
    for k, v in fields.items():
        row = db.query(SettingModel).filter(SettingModel.key == k).first()
        val_str = str(v)
        if row:
            row.value = val_str
        else:
            db.add(SettingModel(key=k, value=val_str))
    db.commit()
    return config

@router.post("/purge-history")
def purge_call_history(db: Session = Depends(get_db)):
    db.query(CallRecordModel).delete()
    db.commit()
    return {"success": True, "message": "Call history and telemetry logs purged securely per privacy policy."}
