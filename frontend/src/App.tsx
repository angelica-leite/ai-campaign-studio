import { useEffect, useState } from "react";
import { FormularioCampanha } from "./components/FormularioCampanha";
import { ListaCampanhas } from "./components/ListaCampanhas";
import {
  listarCampanhas,
  cadastrarCampanha,
  simularVideoCampanha,
} from "./services/campanhas";
import type { Campanha, NovaCampanha } from "./types/campanha";

function App() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [idSimulando, setIdSimulando] = useState<number | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  useEffect(() => {
    async function buscarCampanhas() {
      try {
        const dados = await listarCampanhas();
        setCampanhas(dados);
      } catch {
        setErroCarregamento("Não foi possível carregar as campanhas.");
      } finally {
        setCarregando(false);
      }
    }

    buscarCampanhas();
  }, []);

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

  return (
    <main>
      <h1>AI Campaign Studio</h1>

      <FormularioCampanha salvando={salvando} onCadastrar={criarCampanha} />

      {erroAcao && <p role="alert">{erroAcao}</p>}

      {erroCarregamento ? (
        <p role="alert">{erroCarregamento}</p>
      ) : (
        <ListaCampanhas
          campanhas={campanhas}
          carregando={carregando}
          idSimulando={idSimulando}
          onSimular={simularVideo}
        />
      )}
    </main>
  );
}

export default App;
