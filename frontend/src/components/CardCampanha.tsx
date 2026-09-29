import type { Campanha } from "../types/campanha";

type CardCampanhaProps = {
  campanha: Campanha;
  simulando: boolean;
  simulacaoBloqueada: boolean;
  onSimular: (id: number) => Promise<void>;
};

const apresentacaoStatus = {
  rascunho: {
    descricao: "Rascunho",
    classe: "status--draft",
  },
  simulado: {
    descricao: "Simulação concluída",
    classe: "status--simulated",
  },
};

export function CardCampanha({
  campanha,
  simulando,
  simulacaoBloqueada,
  onSimular,
}: CardCampanhaProps) {
  const status = apresentacaoStatus[campanha.status];

  return (
    <article className="card">
      <div className="campaign-heading">
        <h3>{campanha.nome}</h3>

        <span className={`status ${status.classe}`}>{status.descricao}</span>
      </div>

      <p className="campaign-prompt">{campanha.prompt}</p>

      {campanha.status === "rascunho" && (
        <button
          type="button"
          onClick={() => void onSimular(campanha.id)}
          disabled={simulacaoBloqueada}
          aria-label={`Simular vídeo da campanha ${campanha.nome}`}
        >
          {simulando ? "Simulando..." : "Simular vídeo"}
        </button>
      )}
    </article>
  );
}
