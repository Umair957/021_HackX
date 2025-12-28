from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.database.models import user, candidate, recruiter, resume_analysis, job
from app.utils.logger import get_logger
import os
import dotenv

dotenv.load_dotenv()
logger = get_logger(__name__)

db_client: AsyncIOMotorClient = None

class Connection:
    @staticmethod
    async def init_db():
        global db_client
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        try:
            db_client = AsyncIOMotorClient(mongo_uri)
            if not db_client:
                raise Exception("Failed to create MongoDB client.")
            else:
                await init_beanie(
                    database=db_client.db, 
                    document_models=[
                        user.User, 
                        candidate.CandidateProfile, 
                        recruiter.CompanyProfile,
                        resume_analysis.ResumeAnalysis,
                        job.Job
                    ]
                )
                ping = await db_client.db.command("ping")
                logger.info("MongoDB connection successful")
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {str(e)}")
            raise e
        
    async def close_db(self):
        """Closes the MongoDB connection."""
        global db_client
        if db_client:
            db_client.close()
            logger.info("Database connection closed")




connect = Connection()