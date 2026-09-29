import { useCallback, useEffect, useState } from "react";
import {
  cadastrarCampanha,
  listarCampanhas,
  simularVideoCampanha,
} from "../services/campanhas";
import type { Campanha, NovaCampanha } from "../types/campanha";

export function useCampanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [idSimulando, setIdSimulando] = useState<number | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  const carregarCampanhas = useCallback(async () => {
    setCarregando(true);
    setErroCarregamento("");

    try {
      const dados = await listarCampanhas();
      setCampanhas(dados);
    } catch {
      setErroCarregamento("Não foi possível carregar as campanhas.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void carregarCampanhas();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [carregarCampanhas]);

  async function criarCampanha(dados: NovaCampanha): Promise<boolean> {
    setSalvando(true);
    setErroAcao("");

    try {
      const novaCampanha = await cadastrarCampanha(dados);

      setCampanhas((listaAtual) => [novaCampanha, ...listaAtual]);

      return true;
    } catch {
      setErroAcao("Não foi possível cadastrar a campanha.");
      return false;
    } finally {
      setSalvando(false);
    }
  }

  async function simularVideo(id: number): Promise<void> {
    setIdSimulando(id);
    setErroAcao("");

    try {
      const campanhaAtualizada = await simularVideoCampanha(id);

      setCampanhas((listaAtual) =>
        listaAtual.map((campanha) =>
          campanha.id === id ? campanhaAtualizada : campanha,
        ),
      );
    } catch {
      setErroAcao("Não foi possível simular o vídeo.");
    } finally {
      setIdSimulando(null);
    }
  }

  return {
    campanhas,
    carregando,
    salvando,
    idSimulando,
    erroCarregamento,
    erroAcao,
    carregarCampanhas,
    criarCampanha,
    simularVideo,
  };
}
