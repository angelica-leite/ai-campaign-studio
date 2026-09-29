import sqlite3
from contextlib import contextmanager
from pathlib import Path

CAMINHO_BANCO = Path(__file__).resolve().parent / "campanhas.db"


@contextmanager
def conectar_banco():
    conexao = sqlite3.connect(CAMINHO_BANCO)
    conexao.row_factory = sqlite3.Row

    try:
        yield conexao
        conexao.commit()
    except Exception:
        conexao.rollback()
        raise
    finally:
        conexao.close()


def criar_tabela():
    with conectar_banco() as conexao:
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS campanhas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                prompt TEXT NOT NULL,
                status TEXT NOT NULL
            )
        """)