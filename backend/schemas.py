from typing import Literal

from pydantic import BaseModel, Field


class NovaCampanha(BaseModel):
    nome: str = Field(min_length=2)
    prompt: str = Field(min_length=10)


class CampanhaResposta(BaseModel):
    id: int
    nome: str
    prompt: str
    status: Literal["rascunho", "simulado"]