export type Campanha = {
  id: number;
  nome: string;
  prompt: string;
  status: "rascunho" | "simulado";
};

export type NovaCampanha = {
  nome: string;
  prompt: string;
};
