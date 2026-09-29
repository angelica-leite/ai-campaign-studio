import type { Campanha } from "../types/campanha";

type ListaCampanhasProps = {
  campanhas: Campanha[];
  carregando: boolean;
  idSimulando: number | null;
  onSimular: (id: number) => Promise<void>;
};

const descricaoStatus: Record<Campanha["status"], string> = {
  rascunho: "Rascunho",
  simulado: "Simulação concluída",
};

export function ListaCampanhas({
  campanhas,
  carregando,
  idSimulando,
  onSimular,
}: ListaCampanhasProps) {
  return (
    <section aria-labelledby="titulo-campanhas">
      <h2 id="titulo-campanhas">Minhas campanhas</h2>

      {carregando && <p>Carregando campanhas...</p>}

      {!carregando && campanhas.length === 0 && (
        <p>Nenhuma campanha cadastrada.</p>
      )}

      {!carregando && campanhas.length > 0 && (
        <ul>
          {campanhas.map((campanha) => (
            <li key={campanha.id}>
              <h3>{campanha.nome}</h3>
              <p>{campanha.prompt}</p>
              <p>Status: {descricaoStatus[campanha.status]}</p>

              <button
                type="button"
                onClick={() => onSimular(campanha.id)}
                disabled={
                  idSimulando !== null || campanha.status === "simulado"
                }
              >
                {idSimulando === campanha.id ? "Simulando..." : "Simular vídeo"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
