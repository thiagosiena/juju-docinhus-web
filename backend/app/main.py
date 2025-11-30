# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import public, admin

app = FastAPI(title="Cardápio Digital")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(public.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "API do Cardápio rodando"}
