"""
CampusFind - FastAPI Backend
Provides RESTful CRUD endpoints for Lost Items, Found Items, Claims, and Campus Stats.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="CampusFind API", version="1.0.0", description="Campus Lost & Found REST API")

# Enable CORS for frontend Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Models -----------------

class LostItemCreate(BaseModel):
    title: str
    description: str
    category: str
    location_lost: str
    date_lost: str
    photo_urls: Optional[List[str]] = []
    poster_id: Optional[str] = "user_alex"
    poster_name: Optional[str] = "Alex Rivera"
    email: str
    phone: Optional[str] = ""
    display_name: bool = True

class LostItem(LostItemCreate):
    id: str
    status: str = "open"
    date_posted: str
    created_at: str

class FoundItemCreate(BaseModel):
    title: str
    description: str
    category: str
    location_found: str
    date_found: str
    holding_location: str
    photo_urls: Optional[List[str]] = []
    finder_id: Optional[str] = "user_jordan"
    finder_name: Optional[str] = "Jordan Smith"
    email: str
    phone: Optional[str] = ""
    display_name: bool = True

class FoundItem(FoundItemCreate):
    id: str
    status: str = "open"
    date_posted: str
    created_at: str

class ClaimCreate(BaseModel):
    found_item_id: str
    item_title: Optional[str] = ""
    description: str
    claimer_id: Optional[str] = "user_alex"
    claimer_name: Optional[str] = "Alex Rivera"
    claimer_email: Optional[str] = "alex.rivera@campus.edu"
    claimer_phone: Optional[str] = "(555) 234-5678"

class Claim(ClaimCreate):
    id: str
    status: str = "pending"
    created_at: str

class ClaimStatusUpdate(BaseModel):
    status: str

# ----------------- Seed In-Memory / Redis-Ready Store -----------------

lost_db: List[dict] = [
    {
        "id": "lost-101",
        "title": "Space Gray MacBook Air M2 13-inch",
        "description": "Left inside a dark gray neoprene sleeve on desk 34 in 3rd-floor quiet study area. Has a GitHub sticker and a small scratch on top left lid.",
        "category": "Electronics",
        "location_lost": "Central Library - 3rd Floor Quiet Study",
        "date_lost": "2026-09-18",
        "date_posted": "2026-09-18T14:30:00Z",
        "photo_urls": [],
        "poster_id": "user_alex",
        "poster_name": "Alex Rivera",
        "email": "alex.rivera@campus.edu",
        "phone": "(555) 234-5678",
        "display_name": True,
        "status": "open",
        "created_at": "2026-09-18T14:30:00Z"
    },
    {
        "id": "lost-102",
        "title": "AirPods Pro (2nd Gen) in Matte Black Case",
        "description": "Lost during Wednesday afternoon Physics lecture in Hall B. Case has a small carabiner attached and left earbud has an orange silicone tip.",
        "category": "Electronics",
        "location_lost": "Engineering Complex - Room 204",
        "date_lost": "2026-09-17",
        "date_posted": "2026-09-17T18:00:00Z",
        "photo_urls": [],
        "poster_id": "user_taylor",
        "poster_name": "Taylor Chen",
        "email": "taylor.chen@campus.edu",
        "phone": "(555) 345-6789",
        "display_name": True,
        "status": "open",
        "created_at": "2026-09-17T18:00:00Z"
    }
]

found_db: List[dict] = [
    {
        "id": "found-201",
        "title": "Dorm Keys on Red University Lanyard",
        "description": "Found on the outdoor concrete bench near the Science Quad fountain. Set of 3 brass keys, plastic RF dorm access fob, and a mini flashlight.",
        "category": "Keys",
        "location_found": "Science Quad & Chemistry Lab",
        "date_found": "2026-09-18",
        "date_posted": "2026-09-18T16:00:00Z",
        "photo_urls": [],
        "finder_id": "user_jordan",
        "finder_name": "Jordan Smith",
        "email": "jordan.smith@campus.edu",
        "phone": "(555) 876-5432",
        "display_name": True,
        "holding_location": "Student Union - Room 102 (Lost & Found Desk)",
        "status": "open",
        "created_at": "2026-09-18T16:00:00Z"
    },
    {
        "id": "found-202",
        "title": "Silver Apple Watch Series 8 with Sport Loop",
        "description": "Found on the couch in the second-floor lounge of the Student Union. Watch has 40% battery remaining, digital lock code required.",
        "category": "Electronics",
        "location_found": "Student Union - Main Lounge",
        "date_found": "2026-09-18",
        "date_posted": "2026-09-18T12:00:00Z",
        "photo_urls": [],
        "finder_id": "user_desk",
        "finder_name": "Officer Davis",
        "email": "campus.security@campus.edu",
        "phone": "(555) 911-0000",
        "display_name": True,
        "holding_location": "Campus Police & Security HQ",
        "status": "open",
        "created_at": "2026-09-18T12:00:00Z"
    }
]

claims_db: List[dict] = [
    {
        "id": "claim-301",
        "found_item_id": "found-201",
        "item_title": "Dorm Keys on Red University Lanyard",
        "description": "These are my North Quad dorm keys. The lanyard has University Athletics on it and the key fob ends in 412.",
        "claimer_id": "user_alex",
        "claimer_name": "Alex Rivera",
        "claimer_email": "alex.rivera@campus.edu",
        "claimer_phone": "(555) 234-5678",
        "status": "pending",
        "created_at": "2026-09-18T17:00:00Z"
    }
]

# ----------------- Routes -----------------

@app.get("/")
def root():
    return {"message": "CampusFind API is running", "endpoints": ["/api/stats", "/api/items/lost", "/api/items/found", "/api/claims"]}

@app.get("/api/stats")
def get_stats():
    total_lost = len(lost_db)
    total_found = len(found_db)
    claimed = sum(1 for i in lost_db if i.get("status") == "claimed") + sum(1 for i in found_db if i.get("status") == "claimed")
    return {
        "total_lost_month": total_lost,
        "total_found_month": total_found,
        "items_claimed": claimed
    }

# Lost Items
@app.get("/api/items/lost")
def list_lost_items():
    return lost_db

@app.post("/api/items/lost")
def create_lost_item(item: LostItemCreate):
    now = datetime.utcnow().isoformat() + "Z"
    new_item = item.dict()
    new_item["id"] = f"lost-{uuid.uuid4().hex[:8]}"
    new_item["status"] = "open"
    new_item["date_posted"] = now
    new_item["created_at"] = now
    lost_db.insert(0, new_item)
    return new_item

@app.put("/api/items/lost/{item_id}")
def update_lost_item(item_id: str, updates: dict):
    for idx, item in enumerate(lost_db):
        if item["id"] == item_id:
            lost_db[idx].update(updates)
            return lost_db[idx]
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/api/items/lost/{item_id}")
def delete_lost_item(item_id: str):
    global lost_db
    lost_db = [i for i in lost_db if i["id"] != item_id]
    return {"status": "success"}

# Found Items
@app.get("/api/items/found")
def list_found_items():
    return found_db

@app.post("/api/items/found")
def create_found_item(item: FoundItemCreate):
    now = datetime.utcnow().isoformat() + "Z"
    new_item = item.dict()
    new_item["id"] = f"found-{uuid.uuid4().hex[:8]}"
    new_item["status"] = "open"
    new_item["date_posted"] = now
    new_item["created_at"] = now
    found_db.insert(0, new_item)
    return new_item

@app.put("/api/items/found/{item_id}")
def update_found_item(item_id: str, updates: dict):
    for idx, item in enumerate(found_db):
        if item["id"] == item_id:
            found_db[idx].update(updates)
            return found_db[idx]
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/api/items/found/{item_id}")
def delete_found_item(item_id: str):
    global found_db
    found_db = [i for i in found_db if i["id"] != item_id]
    return {"status": "success"}

# Claims
@app.get("/api/claims")
def list_claims():
    return claims_db

@app.post("/api/claims")
def create_claim(claim: ClaimCreate):
    now = datetime.utcnow().isoformat() + "Z"
    new_claim = claim.dict()
    new_claim["id"] = f"claim-{uuid.uuid4().hex[:8]}"
    new_claim["status"] = "pending"
    new_claim["created_at"] = now
    claims_db.insert(0, new_claim)
    return new_claim

@app.put("/api/claims/{claim_id}/status")
def update_claim_status(claim_id: str, update: ClaimStatusUpdate):
    for claim in claims_db:
        if claim["id"] == claim_id:
            claim["status"] = update.status
            if update.status == "approved":
                for found in found_db:
                    if found["id"] == claim["found_item_id"]:
                        found["status"] = "claimed"
            return claim
    raise HTTPException(status_code=404, detail="Claim not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
