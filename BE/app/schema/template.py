from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class TemplateSection(BaseModel):
    name: str
    type: str
    order: int
    visible: bool = True
    settings: dict = {}


class TemplateResponse(BaseModel):
    id: str
    name: str
    description: str
    thumbnail_url: Optional[str] = None
    preview_url: Optional[str] = None
    category: str
    primary_color: str
    secondary_color: str
    font_family: str
    font_size: str
    layout_type: str
    spacing: str
    sections: List[dict]
    is_premium: bool
    is_ats_friendly: bool
    tags: List[str]
    created_at: datetime
    updated_at: datetime


class TemplatesListResponse(BaseModel):
    templates: List[TemplateResponse]
    total: int
    category: Optional[str] = None
