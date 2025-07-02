from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    points = Column(Integer)
    game = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)