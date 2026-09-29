from fastapi import APIRouter, HTTPException

import repository
from schemas import CampanhaResposta, NovaCampanha

router = APIRouter(
    prefix="/campanhas",
    tags=["Campanhas"],
)


@router.get("", response_model=list[CampanhaResposta])
def listar_campanhas():
    return repository.listar_campanhas()


@router.post(
    "",
    status_code=201,
    response_model=CampanhaResposta,
)
def criar_campanha(dados: NovaCampanha):
    return repository.criar_campanha(dados)


@router.post(
    "/{campanha_id}/simular",
    response_model=CampanhaResposta,
)
def simular_video(campanha_id: int):
    campanha = repository.simular_campanha(campanha_id)

    if campanha is None:
        raise HTTPException(
            status_code=404,
            detail="Campanha não encontrada",
        )

    return campanha