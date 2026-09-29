import { useState, type FormEvent } from "react";
import type { NovaCampanha } from "../types/campanha";

type FormularioCampanhaProps = {
  salvando: boolean;
  onCadastrar: (dados: NovaCampanha) => Promise<boolean>;
};

export function FormularioCampanha({
  salvando,
  onCadastrar,
}: FormularioCampanhaProps) {
  const [nome, setNome] = useState("");
  const [prompt, setPrompt] = useState("");

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const cadastrado = await onCadastrar({
      nome: nome.trim(),
      prompt: prompt.trim(),
    });

    if (cadastrado) {
      setNome("");
      setPrompt("");
    }
  }

  return (
    <section aria-labelledby="titulo-formulario">
      <h2 id="titulo-formulario">Nova campanha</h2>

      <form onSubmit={enviarFormulario}>
        <div>
          <label htmlFor="nome">Nome da campanha</label>
          <input
            id="nome"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            minLength={2}
            required
            disabled={salvando}
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
            disabled={salvando}
          />
        </div>

        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Criar campanha"}
        </button>
      </form>
    </section>
  );
}
