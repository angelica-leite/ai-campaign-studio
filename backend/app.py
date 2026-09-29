from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import criar_tabela
from routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    criar_tabela()
    yield


app = FastAPI(
    title="AI Campaign Studio",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(router)


@app.get("/")
def inicio():
    return {"mensagem": "Minha API está funcionando!"}