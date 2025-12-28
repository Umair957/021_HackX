import httpx
from datetime import datetime
from typing import List, Dict
from app.schema.trends import LanguageTrend, JobRoleTrend


class TrendsService:
    """Service for fetching real-time trends data"""
    
    def __init__(self):
        self.github_api = "https://api.github.com"
        self.stackoverflow_api = "https://api.stackexchange.com/2.3"
        
    async def get_language_trends(self) -> List[LanguageTrend]:
        """Get programming language trends from multiple sources"""
         
        # Mock data with realistic trends - in production, fetch from APIs
        languages_data = [
            {
                "name": "Python",
                "popularity_score": 95.5,
                "rank": 1,
                "change": "up",
                "percentage_change": 2.3,
                "icon": "🐍"
            },
            {
                "name": "JavaScript",
                "popularity_score": 92.8,
                "rank": 2,
                "change": "stable",
                "percentage_change": 0.1,
                "icon": "⚡"
            },
            {
                "name": "TypeScript",
                "popularity_score": 88.4,
                "rank": 3,
                "change": "up",
                "percentage_change": 5.2,
                "icon": "📘"
            },
            {
                "name": "Java",
                "popularity_score": 85.2,
                "rank": 4,
                "change": "down",
                "percentage_change": -1.5,
                "icon": "☕"
            },
            {
                "name": "Go",
                "popularity_score": 82.1,
                "rank": 5,
                "change": "up",
                "percentage_change": 3.7,
                "icon": "🐹"
            },
            {
                "name": "Rust",
                "popularity_score": 79.6,
                "rank": 6,
                "change": "up",
                "percentage_change": 8.4,
                "icon": "🦀"
            },
            {
                "name": "C++",
                "popularity_score": 76.3,
                "rank": 7,
                "change": "stable",
                "percentage_change": -0.2,
                "icon": "⚙️"
            },
            {
                "name": "C#",
                "popularity_score": 73.8,
                "rank": 8,
                "change": "up",
                "percentage_change": 1.9,
                "icon": "#️⃣"
            },
            {
                "name": "Ruby",
                "popularity_score": 68.5,
                "rank": 9,
                "change": "down",
                "percentage_change": -2.1,
                "icon": "💎"
            },
            {
                "name": "Swift",
                "popularity_score": 65.2,
                "rank": 10,
                "change": "up",
                "percentage_change": 2.8,
                "icon": "🦅"
            }
        ]
        
        return [LanguageTrend(**lang) for lang in languages_data]
    
    async def get_job_role_trends(self) -> List[JobRoleTrend]:
        """Get job role trends from multiple sources"""
        
        # Mock data with realistic trends - in production, fetch from job APIs
        roles_data = [
            {
                "title": "Full Stack Developer",
                "demand_score": 94.2,
                "rank": 1,
                "average_salary": "$110k - $160k",
                "change": "up",
                "percentage_change": 4.5,
                "required_skills": ["React", "Node.js", "TypeScript", "AWS"]
            },
            {
                "title": "Machine Learning Engineer",
                "demand_score": 91.8,
                "rank": 2,
                "average_salary": "$130k - $190k",
                "change": "up",
                "percentage_change": 7.2,
                "required_skills": ["Python", "TensorFlow", "PyTorch", "ML Ops"]
            },
            {
                "title": "DevOps Engineer",
                "demand_score": 89.5,
                "rank": 3,
                "average_salary": "$120k - $170k",
                "change": "up",
                "percentage_change": 3.8,
                "required_skills": ["Kubernetes", "Docker", "CI/CD", "AWS"]
            },
            {
                "title": "Frontend Developer",
                "demand_score": 86.3,
                "rank": 4,
                "average_salary": "$95k - $145k",
                "change": "stable",
                "percentage_change": 0.5,
                "required_skills": ["React", "Vue.js", "CSS", "JavaScript"]
            },
            {
                "title": "Backend Developer",
                "demand_score": 84.7,
                "rank": 5,
                "average_salary": "$105k - $155k",
                "change": "up",
                "percentage_change": 2.1,
                "required_skills": ["Node.js", "Python", "PostgreSQL", "Redis"]
            },
            {
                "title": "Cloud Architect",
                "demand_score": 82.1,
                "rank": 6,
                "average_salary": "$140k - $200k",
                "change": "up",
                "percentage_change": 6.3,
                "required_skills": ["AWS", "Azure", "Terraform", "Microservices"]
            },
            {
                "title": "Data Engineer",
                "demand_score": 79.6,
                "rank": 7,
                "average_salary": "$115k - $165k",
                "change": "up",
                "percentage_change": 5.4,
                "required_skills": ["Python", "Spark", "SQL", "Airflow"]
            },
            {
                "title": "Mobile Developer",
                "demand_score": 76.8,
                "rank": 8,
                "average_salary": "$100k - $150k",
                "change": "stable",
                "percentage_change": -0.3,
                "required_skills": ["React Native", "Flutter", "Swift", "Kotlin"]
            },
            {
                "title": "Security Engineer",
                "demand_score": 74.2,
                "rank": 9,
                "average_salary": "$125k - $180k",
                "change": "up",
                "percentage_change": 4.9,
                "required_skills": ["Security", "Penetration Testing", "SIEM", "Compliance"]
            },
            {
                "title": "Product Manager (Tech)",
                "demand_score": 71.5,
                "rank": 10,
                "average_salary": "$120k - $175k",
                "change": "up",
                "percentage_change": 3.2,
                "required_skills": ["Agile", "Product Strategy", "Analytics", "Communication"]
            }
        ]
        
        return [JobRoleTrend(**role) for role in roles_data]
    
    async def fetch_github_trends(self) -> List[Dict]:
        """Fetch trending repositories from GitHub (optional real-time data)"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.github_api}/search/repositories",
                    params={
                        "q": "stars:>1000",
                        "sort": "stars",
                        "order": "desc",
                        "per_page": 10
                    },
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json().get("items", [])
        except Exception as e:
            print(f"Error fetching GitHub trends: {e}")
        return []
