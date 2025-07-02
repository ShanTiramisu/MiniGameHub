from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database import SessionLocal, engine
import models
import crud
from datetime import datetime

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ScoreCreate(BaseModel):
    name: str
    points: int
    game: str

class ScoreOut(BaseModel):
    name: str
    points: int
    game: str
    timestamp: datetime

    class Config:
        orm_mode = True

@app.get("/games")
def get_games():
    return [
        {"id": 1, "name": "SkiingGame", "description": "Control skier to avoid obstacles"},
        {"id": 2, "name": "JumpingGame", "description": "Jump over obstacles and survive"},
    ]

@app.post("/scores", response_model=ScoreOut)
def submit_score(score: ScoreCreate, db: Session = Depends(get_db)):
    return crud.create_score(db, name=score.name, points=score.points, game=score.game)

@app.get("/scores/{game_name}", response_model=List[ScoreOut])
def get_scores(game_name: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_top_scores(db, game=game_name, skip=skip, limit=limit)

