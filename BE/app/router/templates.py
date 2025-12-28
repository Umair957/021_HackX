from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from app.schema.template import TemplateResponse, TemplatesListResponse
from app.database.models.template import ResumeTemplate
from app.core.security import get_current_user
from app.database.models.user import User

router = APIRouter()


@router.get("/", response_model=TemplatesListResponse)
async def get_templates(
    category: Optional[str] = Query(None, description="Filter by category"),
    is_premium: Optional[bool] = Query(None, description="Filter by premium status"),
    current_user: User = Depends(get_current_user)
):
    """Get all resume templates with optional filters"""
    try:
        query = {}
        if category:
            query["category"] = category
        if is_premium is not None:
            query["is_premium"] = is_premium
        
        templates = await ResumeTemplate.find(query).to_list()
        
        templates_data = [
            TemplateResponse(
                id=str(template.id),
                name=template.name,
                description=template.description,
                thumbnail_url=template.thumbnail_url,
                preview_url=template.preview_url,
                category=template.category,
                primary_color=template.primary_color,
                secondary_color=template.secondary_color,
                font_family=template.font_family,
                font_size=template.font_size,
                layout_type=template.layout_type,
                spacing=template.spacing,
                sections=template.sections,
                is_premium=template.is_premium,
                is_ats_friendly=template.is_ats_friendly,
                tags=template.tags,
                created_at=template.created_at,
                updated_at=template.updated_at
            )
            for template in templates
        ]
        
        return TemplatesListResponse(
            templates=templates_data,
            total=len(templates_data),
            category=category
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching templates: {str(e)}")


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get a specific template by ID"""
    try:
        template = await ResumeTemplate.get(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return TemplateResponse(
            id=str(template.id),
            name=template.name,
            description=template.description,
            thumbnail_url=template.thumbnail_url,
            preview_url=template.preview_url,
            category=template.category,
            primary_color=template.primary_color,
            secondary_color=template.secondary_color,
            font_family=template.font_family,
            font_size=template.font_size,
            layout_type=template.layout_type,
            spacing=template.spacing,
            sections=template.sections,
            is_premium=template.is_premium,
            is_ats_friendly=template.is_ats_friendly,
            tags=template.tags,
            created_at=template.created_at,
            updated_at=template.updated_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching template: {str(e)}")


@router.get("/categories/list")
async def get_categories(current_user: User = Depends(get_current_user)):
    """Get all available template categories"""
    return {
        "categories": [
            {"value": "modern", "label": "Modern", "description": "Contemporary designs with clean lines"},
            {"value": "classic", "label": "Classic", "description": "Traditional professional templates"},
            {"value": "creative", "label": "Creative", "description": "Bold and artistic designs"},
            {"value": "minimal", "label": "Minimal", "description": "Simple and elegant layouts"},
            {"value": "professional", "label": "Professional", "description": "Corporate-ready formats"}
        ]
    }
