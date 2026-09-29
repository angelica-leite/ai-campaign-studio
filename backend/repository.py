from database import conectar_banco
from schemas import NovaCampanha


def listar_campanhas():
    with conectar_banco() as conexao:
        registros = conexao.execute(
            "SELECT id, nome, prompt, status FROM campanhas ORDER BY id DESC"
        ).fetchall()

        return [dict(registro) for registro in registros]


def criar_campanha(dados: NovaCampanha):
    with conectar_banco() as conexao:
        cursor = conexao.execute(
            "INSERT INTO campanhas (nome, prompt, status) VALUES (?, ?, ?)",
            (dados.nome, dados.prompt, "rascunho"),
        )

        return {
            "id": cursor.lastrowid,
            "nome": dados.nome,
            "prompt": dados.prompt,
            "status": "rascunho",
        }


def simular_campanha(campanha_id: int):
    with conectar_banco() as conexao:
        cursor = conexao.execute(
            "UPDATE campanhas SET status = ? WHERE id = ?",
            ("simulado", campanha_id),
        )

        if cursor.rowcount == 0:
            return None

        registro = conexao.execute(
            "SELECT id, nome, prompt, status FROM campanhas WHERE id = ?",
            (campanha_id,),
        ).fetchone()

        return dict(registro)