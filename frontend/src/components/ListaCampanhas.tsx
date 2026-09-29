import { CardCampanha } from "./CardCampanha";
import type { Campanha } from "../types/campanha";

type ListaCampanhasProps = {
  campanhas: Campanha[];
  carregando: boolean;
  idSimulando: number | null;
  onSimular: (id: number) => Promise<void>;
};

export function ListaCampanhas({
  campanhas,
  carregando,
  idSimulando,
  onSimular,
}: ListaCampanhasProps) {
  return (
    <section
      className="campaign-section"
      aria-labelledby="titulo-campanhas"
      aria-busy={carregando}
    >
      <h2 id="titulo-campanhas">Minhas campanhas</h2>

      {carregando && <p aria-live="polite">Carregando campanhas...</p>}

      {!carregando && campanhas.length === 0 && (
        <div className="empty-state">
          <p>Nenhuma campanha cadastrada.</p>
          <p>Use o formulário acima para criar sua primeira campanha.</p>
        </div>
      )}

      {!carregando && campanhas.length > 0 && (
        <ul className="campaign-list">
          {campanhas.map((campanha) => (
            <li key={campanha.id}>
              <CardCampanha
                campanha={campanha}
                simulando={idSimulando === campanha.id}
                simulacaoBloqueada={idSimulando !== null}
                onSimular={onSimular}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
