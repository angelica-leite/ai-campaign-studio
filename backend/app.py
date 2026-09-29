import sqlite3
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

CAMINHO_BANCO = "campanhas.db"


def criar_tabela():
    conexao = sqlite3.connect(CAMINHO_BANCO)

    try:
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS campanhas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                prompt TEXT NOT NULL,
                status TEXT NOT NULL
            )
        """)
        conexao.commit()
    finally:
        conexao.close()


criar_tabela()


class NovaCampanha(BaseModel):
    nome: str = Field(min_length=2)
    prompt: str = Field(min_length=10)


@app.get("/")
def inicio():
    return {"mensagem": "Minha API está funcionando!"}


@app.get("/campanhas")
def listar_campanhas():
    conexao = sqlite3.connect(CAMINHO_BANCO)
    conexao.row_factory = sqlite3.Row

    try:
        registros = conexao.execute(
            "SELECT id, nome, prompt, status FROM campanhas ORDER BY id DESC"
        ).fetchall()

        return [dict(registro) for registro in registros]
    finally:
        conexao.close()


@app.post("/campanhas", status_code=201)
def criar_campanha(campanha: NovaCampanha):
    conexao = sqlite3.connect(CAMINHO_BANCO)

    try:
        cursor = conexao.execute(
            "INSERT INTO campanhas (nome, prompt, status) VALUES (?, ?, ?)",
            (campanha.nome, campanha.prompt, "rascunho"),
        )
        conexao.commit()

        return {
            "id": cursor.lastrowid,
            "nome": campanha.nome,
            "prompt": campanha.prompt,
            "status": "rascunho",
        }
    finally:
        conexao.close()


        @app.post("/campanhas/{campanha_id}/simular")
        def simular_video(campanha_id: int):
            conexao = sqlite3.connect(CAMINHO_BANCO)
            conexao.row_factory = sqlite3.Row

            try:
                campanha = conexao.execute(
                    "SELECT * FROM campanhas WHERE id = ?",
                    (campanha_id,),
                ).fetchone()
        
                if campanha is None:
                    raise HTTPException(
                        status_code=404,
                        detail="Campanha não encontrada",
                    )
        
                conexao.execute(
                    "UPDATE campanhas SET status = ? WHERE id = ?",
                    ("simulado", campanha_id),
                )
                conexao.commit()
        
                campanha_atualizada = conexao.execute(
                    "SELECT * FROM campanhas WHERE id = ?",
                    (campanha_id,),
                ).fetchone()
        
                return dict(campanha_atualizada)
            finally:
                conexao.close()