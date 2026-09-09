from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.connection import get_db
from database.models import ContactModel
from models.schemas import ContactCreate, ContactUpdate, ContactResponse

router = APIRouter(prefix="/api/contacts", tags=["Contacts"])

@router.get("", response_model=List[ContactResponse])
def list_contacts(db: Session = Depends(get_db)):
    contacts = db.query(ContactModel).order_by(ContactModel.name).all()
    return [
        ContactResponse(
            id=c.id,
            name=c.name,
            phone_number=c.phone_number,
            relationship=c.relationship,
            trust_level=c.trust_level,
            voice_profile_enrolled=c.voice_profile_enrolled,
            voice_sample_name=c.voice_sample_name,
            notes=c.notes,
            created_at=c.created_at.strftime("%Y-%m-%d")
        )
        for c in contacts
    ]

@router.post("", response_model=ContactResponse)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    existing = db.query(ContactModel).filter(ContactModel.phone_number == contact.phone_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="A contact with this phone number already exists.")

    new_c = ContactModel(
        name=contact.name,
        phone_number=contact.phone_number,
        relationship=contact.relationship,
        trust_level=contact.trust_level,
        voice_profile_enrolled=contact.voice_profile_enrolled,
        voice_sample_name=contact.voice_sample_name or f"{contact.name.lower().replace(' ', '_')}_sample.wav",
        notes=contact.notes
    )
    db.add(new_c)
    db.commit()
    db.refresh(new_c)

    return ContactResponse(
        id=new_c.id,
        name=new_c.name,
        phone_number=new_c.phone_number,
        relationship=new_c.relationship,
        trust_level=new_c.trust_level,
        voice_profile_enrolled=new_c.voice_profile_enrolled,
        voice_sample_name=new_c.voice_sample_name,
        notes=new_c.notes,
        created_at=new_c.created_at.strftime("%Y-%m-%d")
    )

@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(contact_id: int, contact_update: ContactUpdate, db: Session = Depends(get_db)):
    c = db.query(ContactModel).filter(ContactModel.id == contact_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contact not found.")

    if contact_update.name is not None:
        c.name = contact_update.name
    if contact_update.phone_number is not None:
        c.phone_number = contact_update.phone_number
    if contact_update.relationship is not None:
        c.relationship = contact_update.relationship
    if contact_update.trust_level is not None:
        c.trust_level = contact_update.trust_level
    if contact_update.voice_profile_enrolled is not None:
        c.voice_profile_enrolled = contact_update.voice_profile_enrolled
    if contact_update.notes is not None:
        c.notes = contact_update.notes

    db.commit()
    db.refresh(c)

    return ContactResponse(
        id=c.id,
        name=c.name,
        phone_number=c.phone_number,
        relationship=c.relationship,
        trust_level=c.trust_level,
        voice_profile_enrolled=c.voice_profile_enrolled,
        voice_sample_name=c.voice_sample_name,
        notes=c.notes,
        created_at=c.created_at.strftime("%Y-%m-%d")
    )

@router.delete("/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    c = db.query(ContactModel).filter(ContactModel.id == contact_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Contact not found.")

    db.delete(c)
    db.commit()
    return {"success": True, "message": f"Contact '{c.name}' deleted successfully."}
