from pydantic import BaseModel
from typing import List
from datetime import datetime


class LanguageTrend(BaseModel):
    name: str
    popularity_score: float
    rank: int
    change: str  # "up", "down", "stable"
    percentage_change: float
    icon: str  # icon name or URL


class JobRoleTrend(BaseModel):
    title: str
    demand_score: float
    rank: int
    average_salary: str
    change: str
    percentage_change: float
    required_skills: List[str]


class TrendsResponse(BaseModel):
    languages: List[LanguageTrend]
    job_roles: List[JobRoleTrend]
    last_updated: datetime
    data_source: str
