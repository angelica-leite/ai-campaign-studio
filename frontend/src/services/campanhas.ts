import type { Campanha, NovaCampanha } from "../types/campanha";

const API_URL = "http://127.0.0.1:8000";

export async function listarCampanhas(): Promise<Campanha[]> {
  const resposta = await fetch(`${API_URL}/campanhas`);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as campanhas.");
  }

  return resposta.json();
}

export async function cadastrarCampanha(
  dados: NovaCampanha,
): Promise<Campanha> {
  const resposta = await fetch(`${API_URL}/campanhas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível cadastrar a campanha.");
  }

  return resposta.json();
}

export async function simularVideoCampanha(id: number): Promise<Campanha> {
  const resposta = await fetch(`${API_URL}/campanhas/${id}/simular`, {
    method: "POST",
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível simular o vídeo.");
  }

  return resposta.json();
}
