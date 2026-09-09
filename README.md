# VoiceGuard - AI Voice Scam Detection & Protection

**Smart India Hackathon 2026 Prototype**

AI-powered multi-signal analysis system that detects voice cloning, deepfakes, and sophisticated phone scams in real-time.

---

## 🎯 Quick SIH Demo

**Option 1: Standalone HTML Demo (No Setup Required)**
```bash
# Just open this file in your browser:
voiceguard-sih-demo.html
```
This single-file demo includes everything judges need to see:
- ✅ Safe call verification demo
- 🚨 Fake call detection with explainable AI
- 📄 Report generation workflow
- 🎯 Complete SIH presentation tour

**Option 2: Full React + FastAPI Application**
```bash
# Terminal 1 - Start Backend
cd backend
python -m pip install -r requirements.txt
python main.py

# Terminal 2 - Start Frontend
cd frontend
npm install
npm run dev
```

---

## 📊 Database Architecture

VoiceGuard uses **SQLite** for the prototype (production would use PostgreSQL).

### Database Location
```
backend/database/voiceguard.db
```

### Database Tables

#### 1. **calls**
Stores complete call records with analysis results.

```sql
CREATE TABLE calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    call_id TEXT UNIQUE NOT NULL,
    caller_name TEXT,
    phone_number TEXT NOT NULL,
    caller_type TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration TEXT,
    risk_score INTEGER,
    risk_level TEXT,
    ai_voice_probability REAL,
    scam_probability REAL,
    threats TEXT,  -- JSON array
    recommendation TEXT,
    transcript TEXT,
    audio_file_path TEXT
);
```

#### 2. **contacts**
Trusted contacts with voice biometric profiles.

```sql
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    relationship TEXT,
    trust_level TEXT,
    voice_profile_enrolled BOOLEAN DEFAULT 0,
    voice_sample_path TEXT,
    voice_embedding BLOB,  -- 512-d ECAPA-TDNN vector
    emergency_alert BOOLEAN DEFAULT 1,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **reports**
1930 Cyber Crime incident reports.

```sql
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id TEXT UNIQUE NOT NULL,
    call_id TEXT,
    caller_number TEXT NOT NULL,
    caller_name TEXT,
    threat_type TEXT NOT NULL,
    amount_demanded REAL,
    demanded_upi_or_account TEXT,
    description TEXT,
    transcript TEXT,
    risk_score INTEGER,
    status TEXT DEFAULT 'SUBMITTED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (call_id) REFERENCES calls(call_id)
);
```

#### 4. **analysis_cache**
Caches voice analysis results for performance.

```sql
CREATE TABLE analysis_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audio_hash TEXT UNIQUE NOT NULL,
    voice_analysis JSON,
    conversation_analysis JSON,
    caller_analysis JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Accessing the Database

**Python (Backend):**
```python
from database.connection import SessionLocal
from database.models import Call, Contact, Report

# Create a session
db = SessionLocal()

# Query calls
calls = db.query(Call).filter(Call.risk_score > 80).all()

# Add a new contact
new_contact = Contact(
    name="Dad",
    phone_number="+91 98765 43210",
    relationship="Family",
    trust_level="HIGH_TRUST",
    voice_profile_enrolled=True
)
db.add(new_contact)
db.commit()
```

**Direct SQL:**
```bash
sqlite3 backend/database/voiceguard.db

# View all calls
SELECT call_id, caller_name, risk_score, risk_level FROM calls;

# View reports
SELECT report_id, threat_type, status FROM reports;

# View contacts
SELECT name, phone_number, voice_profile_enrolled FROM contacts;
```

### Seeding Demo Data

The database is automatically seeded with realistic demo data on startup:

```python
# backend/database/seed_data.py
# Creates:
# - 18 sample calls (safe family calls + suspicious scam calls)
# - 5 trusted contacts with voice profiles
# - 2 incident reports
```

To reset the database:
```bash
cd backend
rm database/voiceguard.db
python main.py  # Will recreate and seed
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           FRONTEND (React + TypeScript)         │
│  - Landing Page                                 │
│  - Dashboard with Demo Controls                 │
│  - Safe/Fake Call Modals                        │
│  - Report Submission                            │
└─────────────────────────────────────────────────┘
                      ↓ REST API
┌─────────────────────────────────────────────────┐
│          BACKEND (FastAPI + Python)             │
│                                                 │
│  /api/analyze-call    - Analyze incoming call  │
│  /api/analyze-audio   - Analyze audio file     │
│  /api/calls           - Call CRUD operations   │
│  /api/contacts        - Contact management     │
│  /api/reports         - Report submission      │
│  /api/statistics      - Dashboard analytics    │
│  /api/protection/*    - Block/verify/alert     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│             AI/ML ANALYSIS ENGINE               │
│                                                 │
│  VoiceAnalyzer      - Acoustic analysis        │
│  ConversationAnalyzer - NLP & intent detection │
│  CallerAnalyzer     - Identity verification    │
│  RiskEngine         - Multi-signal scoring     │
│  ThreatClassifier   - Threat categorization    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              DATABASE (SQLite)                  │
│  - calls                                        │
│  - contacts (with voice embeddings)             │
│  - reports                                      │
│  - analysis_cache                               │
└─────────────────────────────────────────────────┘
```

---

## 🚀 API Endpoints

### Call Analysis
```http
POST /api/analyze-call
Content-Type: application/json

{
  "caller_name": "Unknown Caller",
  "phone_number": "+1 555 0123",
  "scenario": "ai_bank_scam"
}
```

### Audio Upload
```http
POST /api/analyze-audio
Content-Type: multipart/form-data

file: audio.wav
caller_name: "Inspector Vijay"
phone_number: "+1 800 555 0199"
```

### Submit Report
```http
POST /api/reports
Content-Type: application/json

{
  "caller_number": "+1 555 0123",
  "threat_type": "AI Voice Clone & Financial Fraud",
  "amount_demanded": 50000,
  "description": "..."
}
```

---

## 🎓 For SIH Judges

### Key Innovation Points

1. **Multi-Signal Analysis** (Not just voice)
   - Voice acoustic analysis (synthetic detection)
   - Conversation semantic analysis (intent detection)
   - Caller identity verification (reputation check)
   - Behavioral pattern analysis (urgency detection)
   - Metadata validation (VoIP/spoofing detection)

2. **Explainable AI**
   - Transparent risk scoring (35% + 25% + 20% + 12% + 8%)
   - Clear reasoning for every decision
   - Visual risk breakdown
   - Human-understandable explanations

3. **Real-time Protection**
   - Instant threat detection
   - Automated defensive actions
   - Family alert system
   - 1930 Cyber Crime reporting integration

4. **Privacy-First Design**
   - Local voice profile storage
   - Encrypted biometric data
   - User-controlled deletion
   - Minimal data retention

### Demo Flow (3 minutes)

1. **Start**: Open `voiceguard-sih-demo.html` → Click "🎯 SIH Demo Tour"
2. **Safe Call**: Shows genuine contact verification (3% risk)
3. **Fake Call**: Shows AI deepfake detection (94% risk) with full explainability
4. **Report**: Shows incident reporting to 1930 portal
5. **Dashboard**: Shows statistics and call history

---

## 📁 Project Structure

```
VoiceGuard-Hackathon/
├── voiceguard-sih-demo.html     # Standalone demo (no setup needed)
├── backend/
│   ├── main.py                   # FastAPI entry point
│   ├── requirements.txt          # Python dependencies
│   ├── database/
│   │   ├── connection.py         # SQLite connection
│   │   ├── models.py             # SQLAlchemy models
│   │   ├── seed_data.py          # Demo data seeding
│   │   └── voiceguard.db         # SQLite database file
│   ├── ml/
│   │   ├── voice_analyzer.py     # Voice analysis engine
│   │   ├── conversation_analyzer.py
│   │   ├── caller_analyzer.py
│   │   ├── risk_engine.py        # Risk scoring
│   │   └── threat_classifier.py
│   ├── api/
│   │   ├── analysis.py           # Analysis endpoints
│   │   ├── calls.py              # Call CRUD
│   │   ├── contacts.py           # Contact management
│   │   ├── reports.py            # Report submission
│   │   └── statistics.py         # Analytics
│   └── utils/
│       ├── audio_processor.py    # Audio file handling
│       └── helpers.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main React app
│   │   ├── components/
│   │   │   ├── landing/          # Landing page
│   │   │   ├── dashboard/        # Dashboard views
│   │   │   ├── demo/             # Demo modals
│   │   │   ├── analysis/         # Analysis view
│   │   │   ├── contacts/         # Contact management
│   │   │   └── reports/          # Report submission
│   │   └── services/
│   │       └── api.ts            # API client
│   ├── package.json
│   └── tsconfig.json
└── README.md                     # This file
```

---

## 🔒 Security Considerations

- Input validation on all API endpoints
- File type and size restrictions for audio uploads
- SQL injection prevention (SQLAlchemy ORM)
- CORS configuration for production
- Rate limiting on analysis endpoints
- Sensitive data encryption at rest

---

## 🚧 Production Enhancements

For real-world deployment:

1. **Database**: Migrate from SQLite to PostgreSQL
2. **Voice Analysis**: Integrate real ML models (ECAPA-TDNN, Wav2Vec2)
3. **Scalability**: Add Redis caching, message queue (Celery)
4. **Authentication**: Implement JWT-based auth
5. **Monitoring**: Add logging, metrics (Prometheus)
6. **Deployment**: Containerize (Docker), orchestrate (Kubernetes)

---

## 📞 Contact

**Team**: VoiceGuard Development Team  
**Event**: Smart India Hackathon 2026  
**Problem Statement**: AI Voice Scam Detection & Protection

---

## 📄 License

Prototype for Smart India Hackathon 2026
