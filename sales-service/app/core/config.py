from pydantic import BaseSettings


class Settings(BaseSettings):
    # DATABASE_URL: str
    # CATALOG_SERVICE_URL: str
    # DATABASE_URL: str = "postgresql://root:123456@localhost:5432/salesdb"
    # CATALOG_SERVICE_URL: str = "http://localhost:3000"

    DATABASE_URL: str
    CATALOG_SERVICE_URL: str
    TAX_RATE: float

    class Config:
        env_file = ".env"


settings = Settings()
