from sqlalchemy.orm import Session
from models import Score
from datetime import datetime

def create_score(db: Session, name: str, points: int, game: str):
    db_score = Score(name=name, points=points, game=game, timestamp=datetime.utcnow())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def get_top_scores(db: Session, game: str, skip: int = 0, limit: int = 10):
    return (
        db.query(Score)
        .filter(Score.game == game)
        .order_by(Score.points.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

