from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import conectar_banco, criar_tabela
from schemas import CampanhaResposta, NovaCampanha


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


@app.get("/")
def inicio():
    return {"mensagem": "Minha API está funcionando!"}


@app.get("/campanhas", response_model=list[CampanhaResposta])
def listar_campanhas():
    with conectar_banco() as conexao:
        registros = conexao.execute(
            "SELECT id, nome, prompt, status FROM campanhas ORDER BY id DESC"
        ).fetchall()

        return [dict(registro) for registro in registros]


@app.post(
    "/campanhas",
    status_code=201,
    response_model=CampanhaResposta,
)
def criar_campanha(campanha: NovaCampanha):
    with conectar_banco() as conexao:
        cursor = conexao.execute(
            "INSERT INTO campanhas (nome, prompt, status) VALUES (?, ?, ?)",
            (campanha.nome, campanha.prompt, "rascunho"),
        )

        return {
            "id": cursor.lastrowid,
            "nome": campanha.nome,
            "prompt": campanha.prompt,
            "status": "rascunho",
        }


@app.post(
    "/campanhas/{campanha_id}/simular",
    response_model=CampanhaResposta,
)
def simular_video(campanha_id: int):
    with conectar_banco() as conexao:
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

        campanha_atualizada = conexao.execute(
            "SELECT * FROM campanhas WHERE id = ?",
            (campanha_id,),
        ).fetchone()

        return dict(campanha_atualizada)