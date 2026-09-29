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
  const [erroValidacao, setErroValidacao] = useState("");

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const dados = {
      nome: nome.trim(),
      prompt: prompt.trim(),
    };

    if (dados.nome.length < 2) {
      setErroValidacao("Informe um nome com pelo menos 2 caracteres.");
      return;
    }

    if (dados.prompt.length < 10) {
      setErroValidacao("Descreva o vídeo com pelo menos 10 caracteres.");
      return;
    }

    setErroValidacao("");

    const cadastrado = await onCadastrar(dados);

    if (cadastrado) {
      setNome("");
      setPrompt("");
    }
  }

  return (
    <section className="card" aria-labelledby="titulo-formulario">
      <h2 id="titulo-formulario">Nova campanha</h2>

      <form onSubmit={enviarFormulario}>
        <div className="form-field">
          {" "}
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
        <div className="form-field">
          {" "}
          <label htmlFor="prompt">Descrição do vídeo</label>
          <textarea
            id="prompt"
            aria-describedby="ajuda-prompt"
            placeholder="Descreva o produto, o público e o estilo do vídeo."
            value={prompt}
            onChange={(evento) => setPrompt(evento.target.value)}
            minLength={10}
            required
            disabled={salvando}
          />
          <p id="ajuda-prompt" className="helper-text">
            Escreva pelo menos 10 caracteres.
          </p>
        </div>
        {erroValidacao && (
          <p role="alert" className="error-message">
            {erroValidacao}
          </p>
        )}{" "}
        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Criar campanha"}
        </button>
      </form>
    </section>
  );
}
