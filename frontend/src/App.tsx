import { useEffect, useState, type FormEvent } from "react";

type Campanha = {
  id: number;
  nome: string;
  prompt: string;
  status: string;
};

function App() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [nome, setNome] = useState("");
  const [prompt, setPrompt] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [idSimulando, setIdSimulando] = useState<number | null>(null);

  useEffect(() => {
    async function buscarCampanhas() {
      try {
        const resposta = await fetch("http://127.0.0.1:8000/campanhas");

        if (!resposta.ok) {
          throw new Error("Falha ao buscar campanhas");
        }

        const dados: Campanha[] = await resposta.json();
        setCampanhas(dados);
      } catch {
        setErro("Erro ao buscar campanhas. Confira se a API está ligada.");
      } finally {
        setCarregando(false);
      }
    }

    buscarCampanhas();
  }, []);

  async function criarCampanha(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setSalvando(true);
    setErro("");

    try {
      const resposta = await fetch("http://127.0.0.1:8000/campanhas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          prompt: prompt.trim(),
        }),
      });

      if (!resposta.ok) {
        throw new Error("Falha ao criar campanha");
      }

      const novaCampanha: Campanha = await resposta.json();

      setCampanhas((listaAtual) => [novaCampanha, ...listaAtual]);
      setNome("");
      setPrompt("");
    } catch {
      setErro("Não foi possível criar a campanha. Confira os dados e a API.");
    } finally {
      setSalvando(false);
    }
  }

  async function simularVideo(id: number) {
    setIdSimulando(id);
    setErro("");

    try {
      const resposta = await fetch(
        `http://127.0.0.1:8000/campanhas/${id}/simular`,
        {
          method: "POST",
        },
      );

      if (!resposta.ok) {
        throw new Error("Falha ao simular vídeo");
      }

      const campanhaAtualizada: Campanha = await resposta.json();

      setCampanhas((listaAtual) =>
        listaAtual.map((campanha) =>
          campanha.id === id ? campanhaAtualizada : campanha,
        ),
      );
    } catch {
      setErro("Não foi possível simular o vídeo. Tente novamente.");
    } finally {
      setIdSimulando(null);
    }
  }

  return (
    <main>
      <h1>AI Campaign Studio</h1>

      <section aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario">Nova campanha</h2>

        <form onSubmit={criarCampanha}>
          <div>
            <label htmlFor="nome">Nome da campanha</label>
            <input
              id="nome"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              minLength={2}
              required
            />
          </div>

          <div>
            <label htmlFor="prompt">Descrição do vídeo</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(evento) => setPrompt(evento.target.value)}
              minLength={10}
              required
            />
          </div>

          <button type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Criar campanha"}
          </button>
        </form>
      </section>

      {erro && <p role="alert">{erro}</p>}

      <section aria-labelledby="titulo-campanhas">
        <h2 id="titulo-campanhas">Minhas campanhas</h2>

        {carregando && <p>Carregando campanhas...</p>}

        {!carregando && !erro && campanhas.length === 0 && (
          <p>Nenhuma campanha cadastrada.</p>
        )}

        {!carregando && campanhas.length > 0 && (
          <ul>
            {campanhas.map((campanha) => (
              <li key={campanha.id}>
                <h3>{campanha.nome}</h3>
                <p>{campanha.prompt}</p>
                <p>Status: {campanha.status}</p>
                <button
                  type="button"
                  onClick={() => simularVideo(campanha.id)}
                  disabled={
                    idSimulando !== null || campanha.status === "simulado"
                  }
                >
                  {idSimulando === campanha.id
                    ? "Simulando..."
                    : "Simular vídeo"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
