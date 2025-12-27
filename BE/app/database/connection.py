from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.database.models import user, candidate, recruiter
import os
import dotenv

dotenv.load_dotenv()

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
                await init_beanie(database=db_client.db, document_models=[user.User, candidate.CandidateProfile, recruiter.CompanyProfile])
                ping = await db_client.db.command("ping")
                print("MongoDB connection successful:", ping)
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise e
        
    async def close_db(self):
        """Closes the MongoDB connection."""
        global db_client
        if db_client:
            db_client.close()
            print("❌ Database connection closed.")




connect = Connection()