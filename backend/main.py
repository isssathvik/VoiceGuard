import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database.connection import Base, engine
from database.seed_data import seed_database
from api.analysis import router as analysis_router
from api.calls import router as calls_router
from api.contacts import router as contacts_router
from api.reports import router as reports_router
from api.statistics import router as stats_router
from api.protection import router as protection_router
from api.settings import router as settings_router

# Initialize FastAPI application
app = FastAPI(
    title="VoiceGuard AI - Backend Engine",
    description="AI-Powered Voice Scam Detection & Protection System for SIH",
    version="1.0.0"
)

# Configure CORS for local development and SIH Demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(analysis_router)
app.include_router(calls_router)
app.include_router(contacts_router)
app.include_router(reports_router)
app.include_router(stats_router)
app.include_router(protection_router)
app.include_router(settings_router)

@app.on_event("startup")
def on_startup():
    # Create tables and seed initial database
    seed_database()
    print("✓ VoiceGuard SQLite database initialized and seeded successfully.")

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "VoiceGuard AI Engine",
        "monitoring": "ACTIVE",
        "version": "1.0.0",
        "timestamp": "2026-09-04T12:00:00Z"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
