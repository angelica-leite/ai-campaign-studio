import { FormularioCampanha } from "./components/FormularioCampanha";
import { ListaCampanhas } from "./components/ListaCampanhas";
import { useCampanhas } from "./hooks/useCampanhas";

function App() {
  const {
    campanhas,
    carregando,
    salvando,
    idSimulando,
    erroCarregamento,
    erroAcao,
    carregarCampanhas,
    criarCampanha,
    simularVideo,
  } = useCampanhas();

  return (
    <main>
      <header>
        <h1>AI Campaign Studio</h1>
        <p>Cadastre campanhas e simule solicitações de vídeos.</p>
      </header>

      <FormularioCampanha salvando={salvando} onCadastrar={criarCampanha} />

      {erroAcao && <p role="alert">{erroAcao}</p>}

      {erroCarregamento ? (
        <div>
          <p role="alert">{erroCarregamento}</p>

          <button
            type="button"
            onClick={() => void carregarCampanhas()}
            disabled={carregando}
          >
            Tentar novamente
          </button>
        </div>
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
