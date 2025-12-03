from fastapi import FastAPI
from app.api import order_router
from app.core.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sales Service")

origins = [
    "http://localhost:3000",  # Next.js dev server
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # origins you want to allow
    allow_methods=["*"],        # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],        # allow all headers
)

app.include_router(order_router.router)
